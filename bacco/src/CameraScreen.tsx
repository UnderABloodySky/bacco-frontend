/**
 * Displays the device's camera screen
 *
 * @format
 */

import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
// @ts-ignore
import debounce from 'lodash/debounce';

import {
  Camera,
  CameraDevice,
  useCameraDevice,
  useCameraFormat,
} from 'react-native-vision-camera';
import {Button, Dialog, Portal} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';

import CaptureButton from './CaptureButton';
import FloatingBeveragesList, {
  beveragesIconsMap,
} from './FloatingBeveragesList';
import Banner from './Banner';
import Searchbox from './Searchbox';

const {useCallback, useRef, useState} = React;

function CameraScreen(): React.JSX.Element {
  const camera = useRef<Camera>(null);
  const device: CameraDevice = useCameraDevice('back');
  const navigation = useNavigation();
  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [beverageValue, setBeverageValue] = useState('');
  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [isShowingIngredientsDialog, setIsShowingIngredientsDialog] = useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [beveragesHistory, setBeveragesHistory] = useState<string[]>([]);
  const [ingredientsHistory, setIngredientsHistory] = useState<string[]>([]);
  const [beveragesOptions, setBeveragesOptions] = useState<string[]>([]);
  const [ingredientsOptions, setIngredientsOptions] = useState<string[]>([]);
  const [selectedNewBeverage, setSelectedNewBeverage] = useState('');
  const [selectedNewIngredient, setSelectedNewIngredient] = useState('');
  const [searchedBeverage, setSearchedBeverage] = useState('');
  const [searchedIngredient, setSearchedIngredient] = useState('');
  const [photoLocalPath, setPhotoLocalPath] = useState('');
  const [allIngredientsData, setAllIngredientsData] = useState([]);
  const [allBeveragesData, setAllBeveragesData] = useState([]);

  const format = useCameraFormat(device, [{photoHdr: true}]);

  const saveBeverageToHistory = useCallback(
    (beverage: string) => {
      if (!beveragesHistory.includes(beverage)) {
        // only add if it's not already in the list
        const newBeveragesHistory = [...beveragesHistory, beverage];
        setBeveragesHistory(newBeveragesHistory);
        navigation.setParams({beverages: newBeveragesHistory});
      }
    },
    [beveragesHistory, navigation],
  );

  const saveIngredientToHistory = useCallback(
    (ingredient: string) => {
      if (!ingredientsHistory.includes(ingredient)) {
        // only add if it's not already in the list
        const newIngredientsHistory = [...ingredientsHistory, ingredient];
        setIngredientsHistory(newIngredientsHistory);
        navigation.setParams({ingredients: newIngredientsHistory});
      }
    },
    [ingredientsHistory, navigation],
  );

  const onRemoveBeverage = useCallback(
    (beverage: string) => {
      const newBeveragesHistory = beveragesHistory.filter(
        item => item !== beverage,
      );
      setBeveragesHistory(newBeveragesHistory);
      navigation.setParams({beverages: newBeveragesHistory});
    },
    [beveragesHistory, navigation],
  );

  const onRemoveIngredient = useCallback(
    (ingredient: string) => {
      const newIngredientsHistory = ingredientsHistory.filter(
        item => item !== ingredient,
      );
      setIngredientsHistory(newIngredientsHistory);
      navigation.setParams({ingredients: newIngredientsHistory});
    },
    [ingredientsHistory, navigation],
  );

  const clearModal = useCallback(() => {
    setIsShowingDialog(false);
    setBannerMessage('');
    setSearchedBeverage('');
    setSelectedNewBeverage('');
  }, []);

  const clearIngredientsModal = useCallback(() => {
    setIsShowingIngredientsDialog(false);
    setSearchedIngredient('');
    setSelectedNewIngredient('');
  }, []);

  const retrainModelForBeverage = useCallback(
    async (beverage: string) => {
      const fileName = photoLocalPath.substring(
        photoLocalPath.lastIndexOf('/') + 1,
      );
      const fileUri = `file://${photoLocalPath}`;
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
        name: fileName,
      });
      formData.append('beverage', beverage);
      const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      };
      const request = {
        method: 'POST',
        headers: headers,
        body: formData,
      };
      await fetch('http://localhost:8080/beverages/retrain', request);
    },
    [photoLocalPath],
  );

  const searchBeverages = useCallback(async (searchTerm: string) => {
    const url = `http://localhost:8080/beverages/search?name=${searchTerm}`;
    const headers = {
      Accept: 'application/json',
    };
    const request = {
      method: 'GET',
      headers: headers,
    };
    const response = await fetch(url, request);
    const bodyResponse = await response.json();
    const responseBeverages: string[] = [
      ...new Set<string>(
        bodyResponse
          .map((beverage: {name: string}) => beverage.name.toLowerCase())
          .sort((a: string, b: string) => a.localeCompare(b)),
      ),
    ];
    setBeveragesOptions(responseBeverages);
    if (searchTerm === '') {
      setAllBeveragesData(bodyResponse);
    }
  }, []);

  const searchIngredients = useCallback(async (searchTerm: string) => {
    const url = `http://localhost:8080/ingredients/search?name=${searchTerm}`;
    const headers = {
      Accept: 'application/json',
    };
    const request = {
      method: 'GET',
      headers: headers,
    };
    const response = await fetch(url, request);
    const bodyResponse = await response.json();
    const responseIngredients: string[] = [
      ...new Set<string>(
        bodyResponse
          .map((ingredient: {name: string}) => ingredient.name.toLowerCase())
          .sort((a: string, b: string) => a.localeCompare(b)),
      ),
    ];
    setIngredientsOptions(responseIngredients);
    if (searchTerm === '') {
      setAllIngredientsData(bodyResponse);
    }
  }, []);

  const handleSearch = (searchTerm: string) => {
    setSelectedNewBeverage('');
    setSearchedBeverage(searchTerm);
    searchBeverages(searchTerm);
  };

  const handleSearchIngredient = (searchTerm: string) => {
    setSelectedNewIngredient('');
    setSearchedIngredient(searchTerm);
    searchIngredients(searchTerm);
  };

  const debouncedHandleSearch = debounce(handleSearch, 350);

  const debouncedHandleSearchIngredient = debounce(handleSearchIngredient, 350);

  const takePicture = useCallback(async () => {
    if (camera.current) {
      const photo = await camera.current?.takePhoto();
      const filePath = photo.path;
      setPhotoLocalPath(filePath);
      const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
      const fileUri = `file://${photo?.path}`;
      const formData = new FormData();
      formData.append('file', {
        uri: fileUri,
        type: 'image/jpeg',
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
      let responseText = await response.text();
      const jsonResponse = JSON.parse(responseText);
      responseText = jsonResponse.message;
      const scannedSuccessfully = !responseText.includes(' ');
      if (scannedSuccessfully) {
        setBannerMessage(`Se identifico la bebida: ${responseText}`);
      } else {
        setBannerMessage('No se pudo identificar el producto');
      }
      setBeverageValue(responseText);
    }
  }, []);

  const onInitialized = useCallback(() => {
    setIsCameraInitialized(true);
  }, []);

  return (
    <View style={styles.container}>
      <Portal>
        <Banner
          visible={!!beverageValue}
          text={bannerMessage}
          iconName={beveragesIconsMap[beverageValue]}
          onCancel={() => {
            setBeverageValue('');
          }}
          onConfirm={() => {
            setBeverageValue('');
            saveBeverageToHistory(beverageValue);
            searchBeverages('');
          }}
          onFix={() => {
            setIsShowingDialog(true);
            setBeverageValue('');
            searchBeverages('');
          }}
        />
        <Dialog
          visible={isShowingDialog}
          style={styles.dialog}
          onDismiss={clearModal}>
          <Dialog.Title>Selecciona la bebida</Dialog.Title>
          <Dialog.Content>
            <Searchbox
              onChangeText={debouncedHandleSearch}
              text={searchedBeverage}
            />
          </Dialog.Content>
          <Dialog.ScrollArea style={styles.options}>
            <ScrollView>
              {beveragesOptions.map((beverage, index) => (
                <Button
                  key={`beverage-${index}`}
                  contentStyle={styles.beverageOption}
                  icon={
                    'radiobox-' +
                    (selectedNewBeverage === beverage ? 'marked' : 'blank')
                  }
                  onPress={() => {
                    setSearchedBeverage(beverage);
                    setSelectedNewBeverage(beverage);
                  }}>
                  {beverage.toLocaleUpperCase()}
                </Button>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          {selectedNewBeverage && (
            <Dialog.Actions>
              <Button
                onPress={() => {
                  saveBeverageToHistory(selectedNewBeverage);
                  retrainModelForBeverage(selectedNewBeverage);
                  setBeverageValue('');
                  clearModal();
                }}
                style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </Button>
            </Dialog.Actions>
          )}
        </Dialog>
        <Dialog
          visible={isShowingIngredientsDialog}
          style={styles.dialog}
          onDismiss={clearIngredientsModal}>
          <Dialog.Title>Selecciona el ingrediente</Dialog.Title>
          <Dialog.Content>
            <Searchbox
              placeholder="Busca y selecciona un ingrediente"
              onChangeText={debouncedHandleSearchIngredient}
              text={searchedIngredient}
            />
          </Dialog.Content>
          <Dialog.ScrollArea style={styles.options}>
            <ScrollView>
              {ingredientsOptions.map((ingredient, index) => (
                <Button
                  key={`ingredient-${index}`}
                  contentStyle={styles.beverageOption}
                  icon={
                    'radiobox-' +
                    (selectedNewIngredient === ingredient ? 'marked' : 'blank')
                  }
                  onPress={() => {
                    setSearchedIngredient(ingredient);
                    setSelectedNewIngredient(ingredient);
                  }}>
                  {ingredient.toLocaleUpperCase()}
                </Button>
              ))}
            </ScrollView>
          </Dialog.ScrollArea>
          {selectedNewIngredient && (
            <Dialog.Actions>
              <Button
                onPress={() => {
                  saveIngredientToHistory(selectedNewIngredient);
                  clearIngredientsModal();
                }}
                style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </Button>
            </Dialog.Actions>
          )}
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
      <FloatingBeveragesList
        beverages={beveragesHistory}
        ingredients={ingredientsHistory}
        onAddIngredientPress={() => {
          setIsShowingIngredientsDialog(true);
          searchIngredients('');
        }}
        onPressBevarage={beverage => {
          const beverageData = allBeveragesData?.find(
            bev => bev?.name.toLowerCase() === beverage,
          );
          if (beverageData) {
            navigation.navigate('Detalle', {
              beverage: beverageData,
              navBarTitle: 'Detalle de Bebida',
            });
          }
        }}
        onPressIngredient={ingredient => {
          const ingredientData = allIngredientsData?.find(
            ing => ing?.name.toLowerCase() === ingredient,
          );
          if (ingredientData) {
            navigation.navigate('Detalle', {
              ingredient: ingredientData,
              navBarTitle: 'Detalle de Ingrediente',
            });
          }
        }}
        onRemoveBeverage={onRemoveBeverage}
        onRemoveIngredient={onRemoveIngredient}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dialog: {
    position: 'absolute',
    top: 50,
    width: '85%',
    backgroundColor: '#D2C3C3',
  },
  options: {
    maxHeight: 200,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  beverageOption: {
    flexDirection: 'row-reverse',
  },
  confirmButton: {
    backgroundColor: '#370617',
  },
  confirmButtonText: {
    color: '#FFF',
  },
});

export default CameraScreen;
