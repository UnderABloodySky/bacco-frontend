import * as React from 'react';
import {Image, ImageBackground, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useCameraPermission} from 'react-native-vision-camera';
import LandingCard from './LandingCard';

const {useEffect} = React;

const LandingPage = () => {
  const {hasPermission, requestPermission} = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            <Text style={styles.appName}>Bacco</Text>
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
  appName: {
    color: '#D2C3C3',
    fontSize: 60,
    fontWeight: 'bold',
    marginTop: 55,
    textShadowColor: '#444', // Shadow color
    textShadowOffset: {width: 2, height: 2}, // Shadow offset
    textShadowRadius: 4, // Shadow blur radius
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
