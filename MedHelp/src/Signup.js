import React, {useEffect, useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import DateTimePicker from '@react-native-community/datetimepicker';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

function SignupPage({navigation}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [cnp, setCnp] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isFirstNameFocused, setIsFirstNameFocused] = useState(false);
  const [isLastNameFocused, setIsLastNameFocused] = useState(false);
  const [isBirthDateFocused, setIsBirthDateFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isCnpFocuse, setIsCnpFocused] = useState(false);
  const [isPhoneFocuse, setIsPhoneFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isConfirmPasswordFocused, setIsConfirmPasswordFocused] =
    useState(false);
  const [validCnps, setValidCnps] = useState([]);
  const [doctor, setDoctor] = useState('');

  database()
    .ref('/patients')
    .on('value', function (snapshots) {
      let valids = [];
      snapshots.forEach(function (snapshot) {
        valids.push(snapshot.key);
      });
      setValidCnps(valids);
    });

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showPassword);
  };
  const handleSignup = () => {
    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !email ||
      !cnp ||
      !password ||
      !confirmPassword
    ) {
      alert('Toate câmpurile sunt obligatorii');
      return;
    }

    if (email.includes('medhelp')) {
      alert('Adresa de e-mail nu este permisa');
      return;
    }

    console.log('valid: ' + validCnps);
    if (!validCnps.includes(cnp)) {
      alert('CNP invalid - contacteaza doctorul de familie pentru adaugare');
      return;
    }

    database()
      .ref('/patients/' + cnp)
      .once('value', function (snapshot) {
        setDoctor(snapshot.val().doctor);
      });

    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('Menu');
        const newReference = database()
          .ref('/users')
          .child(auth().currentUser.uid);
        newReference.set({
          lastName: lastName,
          firstName: firstName,
          cnp: cnp,
          birthDate: birthDate.toISOString().split('T')[0],
          role: 'pacient',
          doctor: doctor,
        });
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          alert('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          alert('That email address is invalid!');
        }
      });
  };

  return (
    <LinearGradient colors={['#ffffff', '#ff0000']} style={styles.gradient}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <Image source={require('./img/medhelp.png')} style={styles.logo} />
          </View>

          <View style={styles.inputButtonContainer}>
            <Text style={styles.welcomeText}>Creează-ți contul</Text>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Nume"
                style={[styles.input, isLastNameFocused && styles.focusedInput]}
                value={lastName}
                onChangeText={text => setLastName(text)}
                onFocus={() => setIsLastNameFocused(true)}
                onBlur={() => setIsLastNameFocused(false)}
              />
              <TextInput
                placeholder="Prenume"
                style={[
                  styles.input,
                  isFirstNameFocused && styles.focusedInput,
                ]}
                value={firstName}
                onChangeText={text => setFirstName(text)}
                onFocus={() => setIsFirstNameFocused(true)}
                onBlur={() => setIsFirstNameFocused(false)}
              />

              <View
                style={[
                  styles.birthdateContainer,
                  isBirthDateFocused && styles.focusedInput,
                ]}>
                <TouchableOpacity
                  style={[
                    styles.birthdatePicker,
                    isBirthDateFocused && styles.focusedInput,
                  ]}
                  onPress={() => setIsBirthDateFocused(true)}>
                  <Text style={{color: !birthDate ? '#8e8e8e' : 'black'}}>
                    {!birthDate
                      ? 'Selectați data nașterii'
                      : birthDate.toISOString().split('T')[0]}
                  </Text>
                </TouchableOpacity>

                {isBirthDateFocused && (
                  <DateTimePicker
                    value={birthDate || new Date()}
                    mode="date"
                    display="spinner"
                    themeVariant="dark"
                    onChange={(event, selectedDate) => {
                      setIsBirthDateFocused(false);
                      if (selectedDate) {
                        setBirthDate(selectedDate);
                      }
                    }}
                    style={{backgroundColor: 'white', color: 'black'}}
                  />
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Telefon"
                style={[styles.input, isPhoneFocuse && styles.focusedInput]}
                value={phone}
                keyboardType="numeric"
                onChangeText={text => setPhone(text)}
                onFocus={() => setIsPhoneFocused(true)}
                onBlur={() => setIsPhoneFocused(false)}
              />

              <TextInput
                placeholder="CNP"
                style={[styles.input, isCnpFocuse && styles.focusedInput]}
                value={cnp}
                keyboardType="numeric"
                onChangeText={text => setCnp(text)}
                onFocus={() => setIsCnpFocused(true)}
                onBlur={() => setIsCnpFocused(false)}
              />

              <TextInput
                placeholder="Email"
                style={[styles.input, isEmailFocused && styles.focusedInput]}
                value={email}
                onChangeText={text => setEmail(text)}
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
              />
              <View style={styles.passwordContainer}>
                <TextInput
                  require={true}
                  placeholder="Parolă"
                  style={[
                    styles.input,
                    isPasswordFocused ? styles.focusedInput : null,
                  ]}
                  secureTextEntry={!showPassword} // Ascunde/afișează parola în funcție de stadiul showPassword
                  value={password}
                  onChangeText={text => setPassword(text)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={toggleShowPassword}
                  style={styles.eyeIcon}>
                  <FontAwesome
                    name={showPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#393c66"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordContainer}>
                <TextInput
                  require={true}
                  placeholder="Confirmă Parola"
                  style={[
                    styles.input,
                    isConfirmPasswordFocused ? styles.focusedInput : null,
                  ]}
                  secureTextEntry={!showConfirmPassword} // Ascunde/afișează parola în funcție de stadiul showPassword
                  value={confirmPassword}
                  onChangeText={text => setConfirmPassword(text)}
                  onFocus={() => setIsConfirmPasswordFocused(true)}
                  onBlur={() => setIsConfirmPasswordFocused(false)}
                />
                <TouchableOpacity
                  onPress={toggleShowConfirmPassword}
                  style={styles.eyeIcon}>
                  <FontAwesome
                    name={showConfirmPassword ? 'eye-slash' : 'eye'}
                    size={20}
                    color="#393c66"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}>
              <Text style={styles.buttonText}>Creează Cont</Text>
            </TouchableOpacity>

            <Text style={styles.termsText}>
              Prin crearea acestui cont, ești de acord cu{' '}
              <Text style={styles.termsLink}>Termenii și Condițiile</Text>.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    width: '100%',
  },
  logoContainer: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
    borderRadius: 10,
  },
  inputButtonContainer: {
    flex: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: 'white',
    elevation: 5,
    overflow: 'hidden',
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    color: '#393c66',
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    height: 40,
    width: '100%',
    borderBottomColor: '#393c66',
    borderBottomWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    backgroundColor: 'transparent',
  },
  signupButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    borderRadius: 10,
    elevation: 5,
  },
  loginButton: {
    backgroundColor: 'transparent',
    paddingVertical: 15,
  },
  loginButtonText: {
    color: 'black',
    fontSize: 16,
    textAlign: 'center',
  },
  pickerContainer: {
    marginTop: 10,
    padding: 10,
  },
  pickerItemText: {
    fontSize: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  birthdateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  birthdatePicker: {
    flex: 1,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderBottomColor: '#393c66',
    borderBottomWidth: 1,
    paddingLeft: 10,
  },
  termsText: {
    marginTop: 20,
    fontSize: 14,
    color: '#393c66',
    textAlign: 'center',
  },
  termsLink: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#393c66',
    backgroundColor: 'transparent',
  },
  focusedInput: {
    borderBottomColor: 'red',
  },
});

export default SignupPage;
