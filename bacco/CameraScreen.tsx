/**
 * Displays the device's camera screen
 *
 * @format
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  Camera,
  CameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';

import CaptureButton from './CaptureButton';

const {useCallback, useRef, useState} = React;

function CameraScreen({device}: {device: CameraDevice}): React.JSX.Element {
  const camera = useRef<Camera>(null);
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);

  const format = useCameraFormat(device, [{photoHdr: true}]);

  const blobToBase64 = useCallback((blob: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(String(reader.result));
      };
      reader.readAsDataURL(blob);
    });
  }, []);

  const takePicture = useCallback(async () => {
    if (camera.current) {
      const photo = await camera.current?.takePhoto({
        enablePrecapture: true,
      });
      const result = await fetch(`file://${photo?.path}`);
      const blobData = await result.blob();
      const base64Data = await blobToBase64(blobData);
      return base64Data;
      // TODO: send file data to BE and display response.
      // console.log('photo: ', photo);
      // console.log('result: ', result);
      // console.log('blobData: ', blobData);
      // console.log('base64Data: ', base64Data);
    }
  }, [blobToBase64]);

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  return (
    <View style={styles.container}>
      <Camera
        ref={camera}
        format={format}
        style={StyleSheet.absoluteFill}
        device={device}
        onInitialized={onInitialized}
        photoHdr={format?.supportsPhotoHdr}
        photo={true}
        isActive={true}
      />
      <CaptureButton onPress={takePicture} enabled={isCameraInitialized} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default CameraScreen;
