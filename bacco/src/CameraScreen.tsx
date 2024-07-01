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
import {Portal} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';

import CaptureButton from './CaptureButton';
import FloatingBeveragesList, {
  beveragesIconsMap,
} from './FloatingBeveragesList';
import Banner from './Banner';
import SearchWithOptionsDialog from './SearchWithOptionsDialog';

const {useCallback, useRef, useState} = React;

function CameraScreen(): React.JSX.Element {
  const camera = useRef<Camera>(null);
  const device: CameraDevice = useCameraDevice('back');
  const navigation = useNavigation();
  const route = useRoute();

  const [isCameraInitialized, setIsCameraInitialized] = useState(false);
  const [beverageValue, setBeverageValue] = useState('');
  const [isShowingDialog, setIsShowingDialog] = useState(false);
  const [isShowingIngredientsDialog, setIsShowingIngredientsDialog] =
    useState(false);
  const [bannerMessage, setBannerMessage] = useState('');
  const [beveragesHistory, setBeveragesHistory] = useState<string[]>([]);
  const [ingredientsHistory, setIngredientsHistory] = useState<string[]>([]);
  const [beveragesOptions, setBeveragesOptions] = useState<string[]>([]);
  const [ingredientsOptions, setIngredientsOptions] = useState<string[]>([]);
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

  const debouncedSearchBeverages = debounce(searchBeverages, 350);

  const debouncedSearchIngredients = debounce(searchIngredients, 350);

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
            setBeverageValue('');
            setIsShowingDialog(true);
            searchBeverages('');
          }}
        />
        <SearchWithOptionsDialog
          clearDialog={() => {
            setIsShowingDialog(false);
            setBannerMessage('');
          }}
          isShowingDialog={isShowingDialog}
          onChangeSearch={debouncedSearchBeverages}
          onConfirm={confirmedOption => {
            saveBeverageToHistory(confirmedOption);
            retrainModelForBeverage(confirmedOption);
            searchBeverages('');
          }}
          options={beveragesOptions}
        />
        <SearchWithOptionsDialog
          clearDialog={() => {
            setIsShowingIngredientsDialog(false);
          }}
          placeholder="Busca un ingrediente"
          isShowingDialog={isShowingIngredientsDialog}
          onChangeSearch={debouncedSearchIngredients}
          onConfirm={confirmedOption => {
            saveIngredientToHistory(confirmedOption);
            searchIngredients('');
          }}
          options={ingredientsOptions}
        />
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
          searchIngredients('');
          setIsShowingIngredientsDialog(true);
        }}
        onPressBevarage={beverage => {
          const beverageData = allBeveragesData?.find(
            bev => bev?.name.toLowerCase() === beverage,
          );
          if (beverageData) {
            let params = {
              beverage: beverageData,
              navBarTitle: 'Detalle de Bebida',
            };

            if (route?.params) {
              params = {
                ...route?.params,
                ...params,
              };
            }

            navigation.navigate('Detalle', params);
          }
        }}
        onPressIngredient={ingredient => {
          const ingredientData = allIngredientsData?.find(
            ing => ing?.name.toLowerCase() === ingredient,
          );
          if (ingredientData) {
            let params = {
              ingredient: ingredientData,
              navBarTitle: 'Detalle de Ingrediente',
            };

            if (route?.params) {
              params = {
                ...route?.params,
                ...params,
              };
            }

            navigation.navigate('Detalle', params);
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
});

export default CameraScreen;
