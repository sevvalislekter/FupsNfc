import { Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef, nfcManager } from 'react-native-nfc-manager';
export async function writeNfc(text: string) {
    try {
        Alert.alert("Lütfen telefonu yaklaştırın veri yazılacak")
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const record = text.startsWith('http://') || text.startsWith('https://')
            ? Ndef.uriRecord(text)
            : Ndef.textRecord(text);
        const bytes = Ndef.encodeMessage([record]);
        if (!bytes) throw new Error("NDEF verisi kodlanamadı.");
        await (NfcManager as any).writeNdefMessage(bytes);
        Alert.alert('Başarılı', 'NFC etikete veri başarıyla yazıldı.');

    } catch (err) {
        console.warn('NFC yazma hatası:', err);
        Alert.alert('Hata', err instanceof Error ? err.message : 'NFC yazılamadı');
    } finally {
        await NfcManager.cancelTechnologyRequest();
    }
}
