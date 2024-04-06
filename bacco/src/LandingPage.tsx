import * as React from 'react';
import {StyleSheet, View, ImageBackground, Text, Image} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {useCameraPermission} from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/Entypo';
import LandingCard from './LandingCard';

const {useCallback} = React;

const LandingPage = () => {
  const navigation = useNavigation();
  const {hasPermission, requestPermission} = useCameraPermission();
  const handlePressingScanButton = useCallback(async () => {
    if (hasPermission) {
      navigation.navigate('Camera');
    } else {
      const permissionWasGranted = await requestPermission();
      if (permissionWasGranted) {
        navigation.navigate('Camera');
      }
    }
  }, [hasPermission, navigation, requestPermission]);

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../assets/images/landing/3650.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover">
        <View style={styles.overlay}>
          <View
            style={{
              flex: 1,
              top: -30,
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}>
            <Image
              source={require('../assets/images/logo/output-onlinepngtools.png')}
              style={{width: 85, height: 85, top: 50}}
            />
            <Text style={styles.appName}>Bacco</Text>
            <Icon name="drink" size={80} color="#FFBA08" style={styles.icon} />
          </View>
          <View
            style={{
              paddingBottom: 30,
              width: '100%',
              paddingHorizontal: 20,
            }}>
            <LandingCard onPressScanButton={handlePressingScanButton} />
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
    color: '#FFBA08',
    fontSize: 88,
    fontWeight: 'bold',
    marginTop: 20,
    textShadowColor: '#9D0208CC', // Shadow color
    textShadowOffset: {width: 2, height: 2}, // Shadow offset
    textShadowRadius: 4, // Shadow blur radius
    transform: [{rotate: '320deg'}],
  },
  icon: {
    textShadowColor: '#9D0208CC', // Shadow color
    textShadowOffset: {width: 2, height: 2}, // Shadow offset
    textShadowRadius: 4, // Shadow blur radius
  },
});

export default LandingPage;
