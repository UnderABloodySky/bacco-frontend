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
} from 'react-native';



import {useNavigation, useRoute} from '@react-navigation/native';
const logo = require('../assets/images/logo/output-onlinepngtools-light.png');
const google = require('../assets/images/logos/google.png');
const facebook = require('../assets/images/logos/facebook.png');
const instagram = require('../assets/images/logos/instagram.png');
const tiktok = require('../assets/images/logos/tiktok.png');

export default function LoginForm() {
  const [click, setClick] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const isFormValid = () => {
    return username.trim() !== '' && password.trim() !== '';
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('https://localhost:8080/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
      });
      const result = await response.json();
      if (response.ok) {
        const navigation = useNavigation();
        const user = result.user;
        navigation.navigate('Landing', {})//user: user});
        Alert.alert('Login Exitoso!');
      } else {
        setErrorMessage(result.message || 'Usuario o contraseña incorrecta');
      }
    } catch (error) {
      setErrorMessage('Error de conexión. Intenta de nuevo.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={logo} style={styles.image} resizeMode="contain" />
      <Text style={styles.title}>Bienvenido!</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.input}
          placeholder="Email o usuario"
          value={username}
          onChangeText={setUsername}
          autoCorrect={false}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          autoCorrect={false}
          autoCapitalize="none"
        />
      </View>
      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}
      <View style={styles.rememberView}>
        <View style={styles.switch}>
          <Switch
            value={click}
            onValueChange={setClick}
            trackColor={{true: 'green', false: 'gray'}}
          />
          <Text style={styles.rememberText}>Recuerdame</Text>
        </View>
        <View>
          <Pressable onPress={() => Alert.alert('Forget Password!')}>
            <Text style={styles.forgetText}>Olvidaste la contraseña?</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.buttonView}>
        <Pressable
          style={[styles.button, !isFormValid() && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={!isFormValid()}>
          <Text style={styles.buttonText}>Bienvenido</Text>
        </Pressable>
        <Text style={styles.optionsText}>O logueate con</Text>
      </View>

      <View style={styles.mediaIcons}>
        <Image source={google} style={styles.icons} />
        <Image source={instagram} style={styles.icons} />
        <Image source={facebook} style={styles.icons} />
        <Image source={tiktok} style={styles.icons} />
      </View>

      <Text style={styles.footerText}>
        ¿Todavia no tenes una cuenta?
        <Text style={styles.signup}> Registrate!</Text>
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 20,
  },
  image: {
    height: 200,
    width: 210,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center',
    paddingVertical: 40,
    color: 'red',
  },
  inputView: {
    gap: 15,
    width: '100%',
    paddingHorizontal: 40,
    marginBottom: 5,
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderColor: 'red',
    borderWidth: 1,
    borderRadius: 7,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  rememberView: {
    width: '100%',
    paddingHorizontal: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
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
  forgetText: {
    fontSize: 11,
    color: 'red',
  },
  button: {
    backgroundColor: 'red',
    height: 45,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonView: {
    width: '100%',
    paddingHorizontal: 50,
  },
  optionsText: {
    textAlign: 'center',
    paddingVertical: 10,
    color: 'gray',
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
    color: 'gray',
  },
  signup: {
    color: 'red',
    fontSize: 13,
  },
});
