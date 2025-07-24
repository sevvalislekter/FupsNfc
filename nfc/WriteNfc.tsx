import { Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
let isNfcOperationInProgress = false;
export async function writeNfc(text: string) {
    if (isNfcOperationInProgress) {
        Alert.alert("Hata", "Zaten bir NFC işlemi devam ediyor.");
        return;
    }
    isNfcOperationInProgress = true;
    try {
        Alert.alert("NFC Yaz", "Lütfen telefonu NFC etikete yaklaştırın...");
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const record = text.startsWith("http")
            ? Ndef.uriRecord(text)
            : Ndef.textRecord(text);
        const bytes = Ndef.encodeMessage([record]);
        if (bytes) {
            await NfcManager.ndefHandler.writeNdefMessage(bytes);
            Alert.alert("Başarılı", "NFC verisi başarıyla yazıldı.");
        } else {
            Alert.alert("Hata", "NDEF mesajı encode edilemedi.");
        }
    } catch (err) {
        console.warn("NFC Yazma Hatası:", err);
        Alert.alert("Hata", err instanceof Error ? err.message : "Bilinmeyen hata");
    } finally {
        await NfcManager.cancelTechnologyRequest();
        isNfcOperationInProgress = false;
    }
}
