import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import pacientImage from './img/pacient.png';
import doctorImage from './img/doctor.png';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

function Profil() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [role, setRole] = useState('');
  const [cnp, setCnp] = useState('');
  const [doctor, setDoctor] = useState('');
  const [doctorName, setDoctorName] = useState('');
  // Simulează datele utilizatorului (poți înlocui aceste date cu informații reale din starea aplicației)

  database()
    .ref('/users/' + auth().currentUser?.uid)
    .once('value', function (snapshot) {
      setName(snapshot.val().firstName + ' ' + snapshot.val().lastName);
      setDate(snapshot.val().birthDate);
      setRole(snapshot.val().role);
      setDoctor(snapshot.val().doctor);
    });

  database()
    .ref('/users/' + doctor)
    .once('value', function (snapshot) {
      setDoctorName(snapshot.val().firstName + ' ' + snapshot.val().lastName);
    });

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'))
      .finally(() => navigation.navigate('Login'));
  };

  const handleAdd = () => {
    const newReference = database().ref('/patients/' + cnp);
    newReference.set({
      doctor: auth().currentUser.uid,
    });
    alert('Pacient adaugat cu succes!');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      {/* Imaginea utilizatorului */}
      {role === 'doctor' && (
        <Image source={doctorImage} style={styles.userImage} />
      )}

      {role === 'pacient' && (
        <Image source={pacientImage} style={styles.userImage} />
      )}

      {/* Numele utilizatorului */}
      <Text style={styles.userName}>{name}</Text>

      {/* Data nașterii */}
      {role === 'pacient' && (
        <Text style={styles.userInfo}>Data nașterii: {date}</Text>
      )}

      {/* Doctorul de familie */}
      {role === 'pacient' && (
        <Text style={styles.userInfo}>Doctorul de familie: {doctorName}</Text>
      )}

      {role === 'doctor' && (
        <View style={styles.container}>
          <Text style={styles.addPacientText}>Adaugă pacienți</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.cnpInput}
              placeholder="CNP"
              keyboardType="numeric"
              value={cnp}
              onChangeText={text => setCnp(text)}
            />
            <TouchableOpacity style={styles.searchButton} onPress={handleAdd}>
              <Text style={styles.submitButtonText}>Adaugă</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Buton de logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Deconectare</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
    marginLeft: 10,
    marginRight: 10,
  },
  userImage: {
    width: 180,
    height: 180,
    borderRadius: 120,
    marginBottom: 10,
    backgroundColor: 'white',
  },
  addPacientText: {
    fontSize: 16,
    marginBottom: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  cnpInput: {
    flex: 1,
    height: 40,
    marginRight: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
    backgroundColor: 'white',
  },
  searchButton: {
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 5,
  },
  logoutButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    position: 'absolute',
    bottom: 40,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default Profil;
