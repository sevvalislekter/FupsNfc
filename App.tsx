import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Image, Button, Text, TextInput, Alert } from 'react-native';
import { readNfc } from './nfc/ReadNfc';
import { writeNfc } from './nfc/WriteNfc';
import NfcManager from 'react-native-nfc-manager';
import { clearNfc } from './nfc/ClearNfc';
function App() {
  useEffect(() => {

    NfcManager.start();
    async function checkNfcStatus() {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        Alert.alert("Uyarı", "Bu cihazda NFC özelliği bulunmamaktadır. Uygulama NFC fonksiyonlarını kullanamayacaktır.");
        return;
      }

      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        Alert.alert(
          "NFC Kapalı",
          "Lütfen cihazınızın ayarlarından NFC'yi etkinleştirin.",
          [
            { text: "Tamam", onPress: () => { } },
            { text: "Ayarlara Git", onPress: () => NfcManager.goToNfcSetting() } // Ayarlara gitme seçeneği
          ]
        );
      }
    }
    checkNfcStatus();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';
  const [textToWrite, setTextToWrite] = useState('');

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('./img/fups.jpg')} />
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text style={styles.text}>NFC APP</Text>

      <TextInput
        style={styles.input}
        placeholder='Veri girin'
        onChangeText={setTextToWrite}
        value={textToWrite}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="NFC Oku"
          onPress={readNfc}
          color="#03dac6"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="NFC Yaz"
          onPress={() => writeNfc(textToWrite)}
          color="#03dac6"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="NFC SİL"
          onPress={clearNfc}
          color="#03dac6"
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    marginVertical: 20,
    color: 'black',
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 40,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  img: {
    width: 200,
    height: 100,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
    marginHorizontal: 40,
    borderRadius: 10,
    overflow: 'hidden',
  },
});
export default App;