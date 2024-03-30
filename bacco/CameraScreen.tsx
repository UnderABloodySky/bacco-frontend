/**
 * Displays the device's camera screen
 *
 * @format
 */

import React from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';

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
  const [isShowingResponseMessage, setIsShowingResponseMessage] =
    useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const format = useCameraFormat(device, [{photoHdr: true}]);

  const takePicture = useCallback(async () => {
    if (camera.current) {
      setIsShowingResponseMessage(true);
      const photo = await camera.current?.takePhoto();
      const filePath = photo.path;
      const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
      const fileUri = `file://${photo?.path}`;
      const result = await fetch(fileUri);
      const fileType = result.headers.get('content-type');
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: fileType,
        name: fileName,
      });
      const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      };
      const request = {
        method: 'POST',
        headers: headers,
        body: formData,
      };
      const response = await fetch(
        'http://localhost:8080/imgs/upload',
        request,
      );
      const responseText = await response.text();
      setResponseMessage(responseText);
    }
  }, []);

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  const clearModal = useCallback(() => {
    setIsShowingResponseMessage(false);
    setResponseMessage('');
  }, []);

  return (
    <View style={styles.container}>
      <Modal
        visible={isShowingResponseMessage && !!responseMessage}
        transparent
        onRequestClose={clearModal}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{responseMessage}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={clearModal}>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CameraScreen;
