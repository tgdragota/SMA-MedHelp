import React, {useState} from 'react';
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
import {Picker} from '@react-native-picker/picker';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';

const SolicitarePage = () => {
  const [selectedRequest, setSelectedRequest] = useState('');
  const [reason, setReason] = useState('');
  const [name, setName] = useState('');
  const [doctor, setDoctor] = useState('');

  database()
    .ref('/users/' + auth().currentUser?.uid)
    .once('value', function (snapshot) {
      setName(snapshot.val().firstName + ' ' + snapshot.val().lastName);
      setDoctor(snapshot.val().doctor);
    });

  const handleTrimitere = () => {
    if (!selectedRequest) {
      alert('Selectati documentul');
      return;
    }
    const newReference = database().ref('/requests').push();
    newReference.set({
      doctor: doctor,
      pacient: name,
      request: selectedRequest,
      reason: reason,
    });
    alert('Solicitare trimisa cu succes!');
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled">
      <KeyboardAvoidingView style={styles.container}>
        <Image source={require('./img/document.png')} style={styles.cerere} />

        <View style={styles.pickerContainer}>
          <Picker
            style={styles.picker}
            selectedValue={selectedRequest}
            onValueChange={itemValue => setSelectedRequest(itemValue)}>
            {selectedRequest === null && (
              <Picker.Item
                label="Selectează tipul de solicitare:"
                value={null}
              />
            )}
            <Picker.Item
              label="Adeverință pentru angajare"
              value="solicitare1"
            />
            <Picker.Item
              label="Adeverinţă în caz de îmbolnăvire"
              value="solicitare2"
            />
            <Picker.Item
              label="Adeverinţe pentru înscriere în colectivitate"
              value="solicitare4"
            />
            <Picker.Item label="Dovada de (re)vaccinare" value="solicitare5" />
            <Picker.Item label="Avizul epidemiologic" value="solicitare6" />
            <Picker.Item
              label="Adeverință pentru încadrare handicap"
              value="solicitare7"
            />
            {/* Adaugă aici mai multe opțiuni pentru tipurile de solicitări */}
          </Picker>
        </View>

        <View style={styles.motivContainer}>
          <Text style={styles.label}>Motivul solicitării:</Text>
          <TextInput
            style={styles.motivInput}
            placeholder="Introdu motivul aici"
            value={reason}
            onChangeText={text => setReason(text)}
            multiline
          />
        </View>

        <TouchableOpacity
          style={styles.trimitereButton}
          onPress={handleTrimitere}>
          <Text style={styles.trimitereButtonText}>Trimite solicitarea</Text>
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
  cerere: {
    width: 280,
    height: 280,
    borderRadius: 75,
    marginBottom: 50,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    color: '#333',
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'white',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
  },
  motivContainer: {
    marginBottom: 20,
    width: '100%',
  },
  motivInput: {
    height: 100,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
  },
  trimitereButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'relative',
    marginTop: 80,
    marginBottom: 20,
  },
  trimitereButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default SolicitarePage;
