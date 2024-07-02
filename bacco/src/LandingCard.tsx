import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';

const LandingCard = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const goToLogin = () => {
    navigation.navigate('Login', route?.params);
  };

  const goToRegister = () => {
    navigation.navigate('Register', route?.params);
  };

  return (
    <Card elevation={5} style={styles.container}>
      <Card.Content style={styles.textContainer}>
        <Text variant="titleLarge" style={styles.text}>
          Escanea tus bebidas y
        </Text>
        <Text variant="titleLarge" style={styles.text}>
          arma los mejores tragos!
        </Text>
      </Card.Content>
      <View style={styles.identifyButtonsContainer}>
        <View style={styles.identifyButtonContainer}>
          <TouchableOpacity activeOpacity={0.6} onPress={goToLogin}>
            <View style={styles.identifyButton}>
              <Text>Logueate</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.identifyButtonContainer}>
          <TouchableOpacity activeOpacity={0.6} onPress={goToRegister}>
            <View style={styles.identifyButton}>
              <Text>Registrate</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#03071EAA',
  },
  text: {
    color: '#FFF',
  },
  textContainer: {
    alignItems: 'center',
  },
  identifyButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E2CA',
    borderRadius: 100,
    padding: 10,
  },
  identifyButtonContainer: {
    padding: 8,
    alignSelf: 'center',
  },
  identifyButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});

export default LandingCard;
