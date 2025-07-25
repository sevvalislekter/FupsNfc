# NFC APP
Bu projenin amacı nfc çip veya nfc kartları okuyabilen ve  üzerine yazma işlemleri yapan bir uygulamadır.
## Projeye Erişmek için

```bash
git clone https://github.com/sevvalislekter/FupsNfc.git
cd FupsNfc
npm install
npx react-native run-android
```

ios için
cd ios
pod install
cd ..
npx react-native run-ios


# Kullanılan Nfc bileşenler
-NfcManager.start():Nfc bulma teknolojisini  başlatıyor.Bu kodu app.tsx içinde başlattık uygulama açıldığı an başlamış oluyor.

-NfcManager.isSupported():Nfc özellik destekliyor mu 

-NfcManager.isEnabled():Nfc özellik var ama ayarlardan kapalı olması durumunda kullanılır

-NfcManager.goToNfcSetting():Eğer kapalıysa ayarlara yönlendiriyor.

-NfcManager.requestTechnology(NfcTech.Ndef):Yakınlarda  ndef türü bir çip olup olmadığına bakılır

-const tag = await NfcManager.getTag():Daha sonra içindeki veriyi getTagle erişiyoruz

-tag.ndefMessage: tag'in içindeki ndefMessage alınır.Genelde bir dizi içinde olduğu için sırada olan ilk eleman alınır

-Ndef.util.bytesToString(ndefRecord.type): Ndef'i string'e çevirir.

-Uint8Array(ndefRecord.payload):  Nfc'nin anlayacağı şekilde çevriliyor

-ndefRecord.tnf === Ndef.TNF_WELL_KNOWN): verinin türünü bilinen bir değere eşit olup olmadığına bakıyor tnf burada veri türü oluyor.

-Ndef.uri.decodePayload(payloadArray): eğer url ise uri olarak

-Ndef.text.decodePayload(payloadArray); text ise text olarak 

-NfcManager.cancelTechnologyRequest(); Nfc teknolojisiyle işimiz bittiğinde kapatıyoruz

-let isNfcOperationInProgress = false: Birden fazla nfc işlem olmaması için en başta bunu false olarak tanımlıyoruz .

-Ndef.encodeMessage([record]): Ndef'i kaydın içine yazıyor

-const record = text.startsWith("http") ? Ndef.uriRecord(text):Ndef.textRecord(text): Kayıt http veya https ile başlıyorsa url olarak etiketliyor değilse text

-await NfcManager.ndefHandler.writeNdefMessage(bytes): Burada ise yazmak istediğimiz veriyi bu fonksiyonla yazıyoruz
