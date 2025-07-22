import React, { useState } from 'react';
import { View, Button, Alert, ActivityIndicator, StyleSheet, Linking } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

export async function readNfc() {
    const [loading, setLoading] = useState(false);
    async function readNfc() {
        try {
            setLoading(true);
            Alert.alert("NFC Okuma", "Lütfen telefonu NFC etikete yaklaştırın...");

            const isSupported = await NfcManager.isSupported();
            if (!isSupported) {
                Alert.alert("Hata", "Bu cihazda NFC özelliği bulunmamaktadır.");
                setLoading(false);
                return;
            }

            const isEnabled = await NfcManager.isEnabled();
            if (!isEnabled) {
                Alert.alert(
                    "NFC Kapalı",
                    "Lütfen cihaz ayarlarından NFC'yi etkinleştirin.",
                    [
                        { text: "Tamam", onPress: () => { } },
                        { text: "Ayarlar", onPress: () => NfcManager.goToNfcSetting() }
                    ]
                );
                setLoading(false);
                return;
            }
            await NfcManager.requestTechnology(NfcTech.Ndef);
            const tag = await NfcManager.getTag();

            if (!tag || !tag.ndefMessage || tag.ndefMessage.length === 0) {
                Alert.alert("Hata", "NFC etiketi okunamadı veya NDEF mesajı yok.");
                setLoading(false);
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
                            { text: "Tamam", onPress: () => { } },
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
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <Button title="NFC Oku" onPress={readNfc} disabled={loading} />
            {loading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
});
