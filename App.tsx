
import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Image, Button, Text, TextInput, Alert } from 'react-native';
import { readNfc } from './nfc/ReadNfc';
import { writeNfc } from './nfc/WriteNfc';
import NfcManager from 'react-native-nfc-manager';
function App() {
  useEffect(() => {
    NfcManager.start();
    async function checkNfcStatus() {
      const supported = await NfcManager.isSupported();
      if (!supported) {
        Alert.alert("Uyarı", "Bu cihazda NFC özelliği bulunmamaktadır.");
        return;
      }
      const isEnabled = await NfcManager.isEnabled();
      if (!isEnabled) {
        Alert.alert(
          "NFC Kapalı",
          "Lütfen cihazınızın ayarlarından NFC'yi etkinleştirin.",
          [
            { text: "Tamam" },
            { text: "Ayarlara Git", onPress: () => NfcManager.goToNfcSetting() }
          ]
        );
      }
    }
    checkNfcStatus();
  }, []);

  const isDarkMode = useColorScheme() === 'dark';
  const [textToWrite, setTextToWrite] = useState('');
  const [nfcData, setNfcData] = useState('');
  const handleReadNfc = async () => {
    const result = await readNfc();
    if (result) {
      setNfcData(result);
    }
  }

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
          title="NFC YAZ"
          onPress={() => writeNfc(textToWrite)}
          color="#0000ff"
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="NFC OKU"
          onPress={handleReadNfc}
          color="#0000ff"
        />
        <Text style={styles.resultText}>
          {nfcData ? `Okunan Veri: ${nfcData}` : ''}
        </Text>

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
  resultText: {
    fontSize: 18,
    color: 'black',
    textAlign: 'center',
    marginTop: 10,
  },

});

export default App;
