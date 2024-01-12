import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import auth from '@react-native-firebase/auth';

import FontAwesome from 'react-native-vector-icons/FontAwesome';

function LoginPage({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (email.trim() === '' || password.trim() === '') {
      setErrorMessage('Completează toate câmpurile pentru a te autentifica.');
      return;
    }
    // Adaugă logica pentru procesul de login
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.navigate('Menu');
        console.log(`Autentificare cu email: ${email}, parolă: ${password}`);
      })
      .catch(error => {
        setErrorMessage('E-mail sau parola incorecte!');
      });
  };

  const handleGoogleLogin = () => {
    // Adaugă logica pentru autentificarea cu Google
    console.log('Autentificare cu Google');
  };

  const handleNavigateToSignup = () => {
    // Adaugă navigarea către pagina de înregistrare
    navigation.navigate('Signup'); // Asigură-te că 'Signup' este denumirea corectă a ecranului de înregistrare
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LinearGradient
      colors={['#ffffff', '#393c66', '#393c66']}
      style={styles.gradient}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={require('./img/medhelp.png')} style={styles.logo} />
        </View>

        <View style={styles.inputButtonContainer}>
          <View style={styles.inputContainer}>
            <TextInput
              require={true}
              placeholder="Email"
              style={[
                styles.input,
                isEmailFocused ? styles.focusedInput : null,
              ]}
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
          </View>

          <View style={styles.centeredContainer}>
            {errorMessage !== '' && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.buttonText}>Intră în cont</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.noAccountText}
              onPress={handleNavigateToSignup}>
              <Text style={styles.noAccountButtonText}>Nu ai cont încă?</Text>
            </TouchableOpacity>
          </View>

          {/*<Text style={styles.orLoginWithText}>Sau conectează-te cu</Text>*/}
          {/*<TouchableOpacity*/}
          {/*  style={styles.googleButton}*/}
          {/*  onPress={handleGoogleLogin}>*/}
          {/*  /!* Imaginea Google într-un cerc cu umbra *!/*/}
          {/*  <FontAwesome name="google" size={40} color={'#393c66'} />*/}
          {/*</TouchableOpacity>*/}
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  errorMessage: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  container: {
    flex: 1,
    width: '100%',
    marginTop: 70,
  },
  logoContainer: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center', // Alinează pe axa principală
    borderBottomColor: '#393c66',
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  gradient: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
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
    textAlign: 'center',
    marginTop: 30,
    color: '#393c66',
  },
  inputContainer: {
    marginTop: 40,
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
  focusedInput: {
    borderColor: 'red',
  },
  centeredContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loginButton: {
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    marginTop: 40,
    width: '60%',
    marginBottom: 10,
  },
  noAccountText: {
    marginTop: 10,
    fontSize: 16,
    color: '#393c66',
  },
  noAccountButtonText: {
    color: '#393c66', // Schimbă culoarea textului pentru "Nu ai cont încă?"
    fontSize: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  orLoginWithText: {
    fontSize: 16,
    marginTop: 100,
    textAlign: 'center',
    padding: 10,
    color: '#393c66',
    position: 'relative',
    bottom: 20,
  },
  googleButton: {
    backgroundColor: 'transparent',
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    bottom: 30,
  },
  googleIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.3,
    position: 'relative',
    shadowRadius: 5,
    overflow: 'hidden',
  },
  googleIcon: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default LoginPage;
