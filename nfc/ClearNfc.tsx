import { Alert } from 'react-native';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';
export async function clearNfc() {
    try {
        Alert.alert("Telefonu yaklaştırın veri silinecek")
        await NfcManager.requestTechnology(NfcTech.Ndef);
        await (NfcManager as any).writeNdefMessage(Ndef.encodeMessage([]));
        console.log(' NFC başarıyla silindi');
        Alert.alert('NFC başarıyla silindi');
        await NfcManager.cancelTechnologyRequest();
    } catch (err) {
        console.warn(' NFC silme hatası:', err);
        Alert.alert('NFC silinemedi');
        await NfcManager.cancelTechnologyRequest();
    }
}