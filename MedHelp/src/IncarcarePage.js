import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import storage from '@react-native-firebase/storage';
import {utils} from '@react-native-firebase/app';
import {PermissionsAndroid} from 'react-native';
import database from '@react-native-firebase/database';

const IncarcarePage = () => {
  PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  );

  const [cnp, setCNP] = useState('');
  const [file, setFile] = useState(null);

  const handlePickDocument = useCallback(async () => {
    try {
      const result = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
      });
      console.log(result);
      setFile(result.pop());
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const handleTrimitere = () => {
    // Implement your logic for submitting the request here
    console.log(file);
    const reference = storage().ref(cnp + '/' + file.name);
    const pathToFile = utils.FilePath.PICTURES_DIRECTORY + '/' + file.name;
    const task = reference.putFile(pathToFile);
    task.on(
      'state_changed',
      taskSnapshot => {
        const progress =
          taskSnapshot.bytesTransferred / taskSnapshot.totalBytes;
        console.log(`Upload progress: ${progress}%`);
      },
      error => {
        console.log(error);
      },
      complete => {
        reference.getDownloadURL().then(url => {
          const newReference = database()
            .ref('/documents/' + cnp)
            .push();
          newReference.set({
            name: file.name,
            url: url,
          });
        });
      },
    );
    alert('Incarcat cu succes!');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView style={styles.container}>
        <Image source={require('./img/upload.png')} style={styles.upload} />
        <View style={styles.cnpContainer}>
          <Text style={styles.label}>Introdu CNP-ul pacientului:</Text>
          <TextInput
            style={styles.cnpInput}
            placeholder="CNP"
            keyboardType="numeric"
            value={cnp}
            onChangeText={text => setCNP(text)}
          />
        </View>

        <TouchableOpacity
          style={styles.dropzoneContainer}
          onPress={handlePickDocument}>
          <View style={styles.dropzone}>
            {file ? (
              <Text>{file.name}</Text>
            ) : (
              <Text>Apasă pentru a alege un fișier</Text>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.trimitereButton}
          onPress={handleTrimitere}>
          <Text style={styles.trimitereButtonText}>Încarcă documentul</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  scrollContainer: {
    width: '100%',
  },
  upload: {
    width: 220,
    height: 220,
    borderRadius: 75,
    marginBottom: 60,
  },
  cnpContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  cnpInput: {
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
    marginBottom: 10,
  },
  dropzoneContainer: {
    marginBottom: 20,
    width: '100%',
  },
  dropzone: {
    height: 100,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  trimitereButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'relative',
    marginTop: 110,
    marginBottom: 20,
  },
  trimitereButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default IncarcarePage;
