import * as React from 'react';
import {StyleSheet, View, ImageBackground, Text, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useCameraPermission} from 'react-native-vision-camera';
import LandingCard from './LandingCard';

const {useCallback} = React;

const LandingPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {hasPermission, requestPermission} = useCameraPermission();
  const handlePressingScanButton = useCallback(async () => {
    if (hasPermission) {
      navigation.navigate('Camara', route?.params);
    } else {
      const permissionWasGranted = await requestPermission();
      if (permissionWasGranted) {
        navigation.navigate('Camara', route?.params);
      }
    }
  }, [hasPermission, navigation, requestPermission, route?.params]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/landing/3650.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logo/output-onlinepngtools-light.png')}
              style={styles.logo}
            />
          </View>
          <View style={styles.scanButtonContainer}>
            <LandingCard />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Semi-transparent overlay
  },
  logo: {
    height: 160,
    width: 170,
    top: 70,
  },
  logoContainer: {
    flex: 1,
    top: -45,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  scanButtonContainer: {
    paddingBottom: 30,
    width: '100%',
    paddingHorizontal: 20,
  },
});

export default LandingPage;
