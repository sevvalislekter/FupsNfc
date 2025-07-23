
import { Alert, Linking } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

export async function readNfc() {
    try {
        Alert.alert("NFC Okuma", "Lütfen telefonu NFC etikete yaklaştırın...");
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tag = await NfcManager.getTag();

        if (!tag || !tag.ndefMessage || tag.ndefMessage.length === 0) {
            Alert.alert("Hata", "NFC etiketi okunamadı veya NDEF mesajı yok.");
            return;
        }

        const ndefRecord = tag.ndefMessage[0];
        const type = Ndef.util.bytesToString(ndefRecord.type);
        const payloadArray = new Uint8Array(ndefRecord.payload);
        let payload = "";

        if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
            if (type === 'U') {
                payload = Ndef.uri.decodePayload(payloadArray);
            } else if (type === 'T') {
                payload = Ndef.text.decodePayload(payloadArray);
            } else {
                payload = `[Bilinmeyen Tip] ${type}`;
            }
        } else {
            payload = `[Desteklenmeyen TNF] ${ndefRecord.tnf}`;
        }

        if (payload.startsWith('http://') || payload.startsWith('https://')) {
            Alert.alert(
                'URL Bulundu',
                `Tarayıcıda açmak ister misiniz?\n${payload}`,
                [
                    { text: 'İptal', style: 'cancel' },
                    { text: 'Aç', onPress: () => Linking.openURL(payload) }
                ]
            );
        } else {
            Alert.alert('NFC Okundu', payload);

        }
    } catch (ex) {
        console.warn('NFC Okuma Hatası:', ex);
        if (ex instanceof Error) {
            if (ex.message.includes("User cancelled")) {
                Alert.alert("İşlem İptal Edildi", "NFC okuma işlemi kullanıcı tarafından iptal edildi.");
            } else if (ex.message.includes("NFC is not enabled")) {
                Alert.alert(
                    "NFC Kapalı",
                    "Lütfen cihaz ayarlarından NFC'yi açın.",
                    [
                        { text: "Tamam" },
                        { text: "Ayarlar", onPress: () => NfcManager.goToNfcSetting() }
                    ]
                );
            } else {
                Alert.alert('Hata', 'NFC okunamadı: ' + ex.message);
            }
        } else {
            Alert.alert('Hata', 'NFC okunamadı: Bilinmeyen bir hata oluştu.');
        }
    } finally {
        await NfcManager.cancelTechnologyRequest();
    }
}
