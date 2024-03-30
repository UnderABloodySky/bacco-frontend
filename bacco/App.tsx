/**
 * Asks for camera permission. Shows camera when permissions granted.
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import CameraScreen from './CameraScreen';

import {useCameraPermission, useCameraDevice} from 'react-native-vision-camera';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return device && hasPermission ? (
    <CameraScreen device={device} />
  ) : (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.container}>
        {!hasPermission && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={requestPermission}>
            <Text style={[styles.text, styles.darkModeText]}>
              Touch to grant Camera Permission
            </Text>
          </TouchableOpacity>
        )}
        {hasPermission && device == null && (
          <View style={styles.noCameraMessage}>
            <Text
              style={[
                styles.text,
                isDarkMode ? styles.darkModeText : styles.lightModeText,
              ]}>
              No camera recognized
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 30,
    justifyContent: 'flex-end',
  },
  button: {
    padding: 30,
    bottom: 100,
    borderRadius: 10,
    backgroundColor: '#c9ac1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
  },
  darkModeText: {
    color: '#fff',
  },
  lightModeText: {
    color: '#000',
  },
  noCameraMessage: {
    flex: 1,
    padding: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
