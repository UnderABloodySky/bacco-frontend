/**
 * Displays the device's camera screen
 *
 * @format
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

import {
  Camera,
  CameraDevice,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {Button, Dialog, Portal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import CaptureButton from './CaptureButton';
import FloatingBeveragesButton from './FloatingBeveragesButton';

const {useCallback, useRef, useState} = React;

function CameraScreen(): React.JSX.Element {
  const camera = useRef<Camera>(null);
  const device: CameraDevice = useCameraDevice('back');
  const navigation = useNavigation();
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [isShowingResponseMessage, setIsShowingResponseMessage] =
    useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const [beveragesHistory, setBeveragesHistory] = useState<string[]>([]);

  const format = useCameraFormat(device, [{photoHdr: true}]);

  const saveBeverageToHistory = useCallback(
    (beverage: string) => {
      setBeveragesHistory([...beveragesHistory, beverage]);
    },
    [beveragesHistory],
  );

  const clearModal = useCallback(() => {
    setIsShowingResponseMessage(false);
    setResponseMessage('');
  }, []);

  const getRecipes = useCallback(async () => {
    const mapStringsToQueryParams = (strings: string[]) => {
      return strings.map(value => `${encodeURIComponent(value)}`).join('&');
    };
    const queryParams = mapStringsToQueryParams(beveragesHistory);
    const url = `http://localhost:8080/imgs/recipes?beverageNames=${queryParams}`;
    const headers = {
      Accept: 'application/json',
    };
    const request = {
      method: 'GET',
      headers: headers,
    };
    const response = await fetch(url, request);
    const bodyResponse = await response.json();
    clearModal();
    navigation.navigate('Recipes', {recipes: bodyResponse});
  }, [beveragesHistory, clearModal, navigation]);

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
      const scannedSuccessfully = !responseText.includes(' ');
      if (scannedSuccessfully) {
        saveBeverageToHistory(responseText);
      }
      setResponseMessage(responseText);
    }
  }, [saveBeverageToHistory]);

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          visible={isShowingResponseMessage && !!responseMessage}
          style={{
            backgroundColor: '#FAA307',
          }}
          onDismiss={clearModal}>
          <Dialog.Title>Resultado del escaneo</Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                fontSize: 18,
              }}>
              {responseMessage}
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={getRecipes}
              style={{
                backgroundColor: '#370617',
              }}>
              Buscar recetas
            </Button>
            <Button
              onPress={clearModal}
              style={{
                backgroundColor: '#370617',
              }}>
              Continuar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
      {beveragesHistory.length > 0 && (
        <FloatingBeveragesButton
          onPress={getRecipes}
          number={beveragesHistory.length}
        />
      )}
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
