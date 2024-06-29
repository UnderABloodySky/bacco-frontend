import React, {useState} from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const logo = require('../assets/images/logo/output-onlinepngtools-light.png');
const google = require('../assets/images/logos/google.png');
const facebook = require('../assets/images/logos/facebook.png');
const instagram = require('../assets/images/logos/instagram.png');
const tiktok = require('../assets/images/logos/tiktok.png');

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const navigation = useNavigation();

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleNameChange = (text) => {
    setName(text);
    if (text.trim().length < 8 || text.trim().length > 16) {
      setNameError('El nombre debe tener entre 8 y 16 caracteres');
    } else {
      setNameError('');
    }
  };

  const handleEmailChange = (text) => {
    setEmail(text);
    if (!validateEmail(text)) {
      setEmailError('Ingresa un correo electrónico válido');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    if (text.trim().length < 8 || text.trim().length > 16) {
      setPasswordError('La contraseña debe tener entre 8 y 16 caracteres');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    if (text !== password) {
      setConfirmPasswordError('Las contraseñas no coinciden');
    } else {
      setConfirmPasswordError('');
    }
  };

  const handleRegister = async () => {
    if (
      name.trim().length < 8 ||
      name.trim().length > 16 ||
      !validateEmail(email) ||
      password.trim().length < 8 ||
      password.trim().length > 16 ||
      password !== confirmPassword ||
      !isAdult
    ) {
      Alert.alert('Por favor, revisa los campos ingresados.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/users', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name, email, password}),
      });
      const result = await response.json();
      if (response.ok) {
        navigation.navigate('Landing', {
          ...result,
        });
      } else {
        Alert.alert(result.message || 'Error en el registro');
      }
    } catch (error) {
      Alert.alert('Error de conexión. Intenta de nuevo.');
    }
  };

  const isFormValid = () => {
    return (
      name.trim().length >= 8 &&
      name.trim().length <= 16 &&
      validateEmail(email) &&
      password.trim().length >= 8 &&
      password.trim().length <= 16 &&
      password === confirmPassword &&
      isAdult
    );
  };

  const openTermsAndConditions = () => {
    // Aquí puedes ajustar la URL de los términos y condiciones
    Linking.openURL('https://www.example.com/terms');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Regístrate!</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Nombre"
          value={name}
          onChangeText={handleNameChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={email}
          onChangeText={handleEmailChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={handlePasswordChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Repetir contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={handleConfirmPasswordChange}
          autoCorrect={false}
          autoCapitalize="none"
        />
        {confirmPasswordError ? (
          <Text style={styles.errorText}>{confirmPasswordError}</Text>
        ) : null}
      </View>

      <View style={styles.rememberView}>
        <View style={styles.switchContainer}>
          <View style={styles.switch}>
            <Switch
              value={isAdult}
              onValueChange={setIsAdult}
              trackColor={{true: '#F0E2CA', false: 'gray'}}
              thumbColor={isAdult ? '#F0E2CA' : 'gray'}
            />
            <Text style={styles.rememberText}>Soy mayor de edad</Text>
          </View>
        </View>
      </View>

      <Pressable
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!isFormValid()}>
        <Text style={styles.buttonText}>Regístrate</Text>
      </Pressable>

      <View style={styles.optionsTextView}>
        <Text style={styles.optionsText}>También puedes registrarte con</Text>
        <View style={styles.mediaIcons}>
          <Image source={google} style={styles.icons} />
          <Image source={instagram} style={styles.icons} />
          <Image source={facebook} style={styles.icons} />
          <Image source={tiktok} style={styles.icons} />
        </View>
      </View>

      <Text style={styles.footerText}>
        ¿Ya tienes una cuenta?
        <Text style={styles.signup}> Inicia sesión!</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 1,
  },
  image: {
    height: 160,
    width: 170,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 20,
    color: '#03071E',
  },
  inputView: {
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: '#D2C3C3',
    borderWidth: 1,
    borderRadius: 7,
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    color: '#03071E',
  },
  rememberView: {
    width: '100%',
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    marginBottom: 15,
  },
  switch: {
    flexDirection: 'row',
    gap: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rememberText: {
    fontSize: 13,
  },
  linkText: {
    color: '#03071E',
    textDecorationLine: 'underline',
    marginLeft: 5,
  },
  button: {
    backgroundColor: '#03071E',
    height: 45,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionsTextView: {
    alignItems: 'center',
  },
  optionsText: {
    textAlign: 'center',
    color: '#03071E',
    fontSize: 13,
    marginBottom: 6,
  },
  mediaIcons: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 23,
  },
  icons: {
    width: 40,
    height: 40,
  },
  footerText: {
    textAlign: 'center',
    color: '#03071E',
  },
  signup: {
    color: '#03071E',
    fontSize: 13,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 15,
  },
});
