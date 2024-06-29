import React from 'react';
import {Appbar} from 'react-native-paper';
import FloatingBeveragesButton from './FloatingBeveragesButton';
import {StyleSheet} from 'react-native';
// import Banner from './Banner';

const {useCallback, useMemo} = React;

// @ts-ignore
export default function NavBar({navigation, route, back = false}) {
  const title = route?.params?.navBarTitle || route.name;
  // const bannerVisible = route?.params?.bannerVisible;
  const beverages = useMemo(
    () => route?.params?.beverages || [],
    [route?.params],
  );
  const ingredients = useMemo(
    () => route?.params?.ingredients || [],
    [route?.params],
  );
  const recipes = useMemo(() => route?.params?.recipes || [], [route?.params]);
  const getRecipesButtonVisible = beverages?.length || ingredients?.length;

  const getRecipes = useCallback(async () => {
    const mapStringsToQueryParams = (strings: string[]) => {
      return strings.map(value => `${encodeURIComponent(value)}`).join(',');
    };
    const beverageNames = mapStringsToQueryParams(beverages);
    const ingredientNames = mapStringsToQueryParams(ingredients);
    const url = `http://localhost:8080/imgs/recipes?beverageNames=${beverageNames}&ingredientNames=${ingredientNames}`;
    const headers = {
      Accept: 'application/json',
    };
    const request = {
      method: 'GET',
      headers: headers,
    };
    const response = await fetch(url, request);
    const bodyResponse = await response.json();
    // console.log('getRecipes, bodyResponse: ', JSON.stringify(bodyResponse));
    navigation.navigate('Recetas', {
      ...(route?.params || {}),
      beverages: beverages,
      ingredients: ingredients,
      recipes: bodyResponse,
      navBarTitle: 'Resultado de Recetas',
    });
  }, [beverages, ingredients, navigation, route?.params]);

  return (
    <>
      <Appbar.Header style={styles.navbar}>
        {back ? (
          <>
            <Appbar.BackAction onPress={navigation.goBack} color="white" />
            <Appbar.Content title={title} color="white" />
            {title === 'Resultado de Recetas' && (
              <Appbar.Action
                color="white"
                icon="filter-outline"
                onPress={() => {
                  navigation.navigate('Filtro', {
                    ...(route?.params || {}),
                    beverages: beverages,
                    ingredients: ingredients,
                    recipes: recipes,
                    navBarTitle: 'Filtro de Recetas',
                  });
                }}
              />
            )}
            {title === 'Camara' && getRecipesButtonVisible ? (
              <FloatingBeveragesButton onPress={getRecipes} />
            ) : null}
          </>
        ) : null}
      </Appbar.Header>
      {/* <Banner
        visible={title === 'Camara' && bannerVisible}
        onCancel={() => {
          navigation.setParams({bannerVisible: false});
        }}
      /> */}
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#03071E',
  },
});
