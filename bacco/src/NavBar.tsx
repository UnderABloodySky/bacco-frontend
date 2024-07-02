import React from 'react';
import {Appbar, IconButton, Menu} from 'react-native-paper';
import FloatingSearchBeveragesButton from './FloatingSearchBeveragesButton';
import {StyleSheet, Text, View} from 'react-native';

const {useCallback, useMemo, useState} = React;

// @ts-ignore
export default function NavBar({navigation, route, back = false}) {
  const title = route?.params?.navBarTitle || route.name;
  const [isUserMenuVisible, setIsUserMenuVisible] = useState(false);
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
    navigation.navigate('Recetas', {
      ...(route?.params || {}),
      beverages: beverages,
      ingredients: ingredients,
      recipes: bodyResponse,
      navBarTitle: 'Recetas',
    });
  }, [beverages, ingredients, navigation, route?.params]);

  const closeUserMenu = () => {
    setIsUserMenuVisible(false);
  };

  const openUserMenu = () => {
    setIsUserMenuVisible(true);
  };

  return (
    <>
      <Appbar.Header
        mode="center-aligned"
        style={[
          styles.navbar,
          (title === 'Register' || title === 'Login') &&
            styles.transparentBackground,
        ]}>
        {title === 'Camara' && (
          <Menu
            visible={isUserMenuVisible}
            onDismiss={closeUserMenu}
            anchorPosition="bottom"
            anchor={
              <IconButton
                icon="account-circle"
                iconColor="white"
                size={45}
                onPress={openUserMenu}
                style={{
                  marginVertical: 0,
                }}
              />
            }>
            <Menu.Item
              disabled
              trailingIcon="text-box-plus-outline"
              onPress={() => {}}
              title="Crear receta"
            />
            <Menu.Item
              trailingIcon="power-standby"
              onPress={() => {
                closeUserMenu();
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Landing'}],
                });
                // navigation.navigate('Login', {});
              }}
              title="Cerrar sesion"
            />
          </Menu>
        )}
        {back && title !== 'Camara' && (
          <Appbar.BackAction
            onPress={navigation.goBack}
            color={title === 'Register' || title === 'Login' ? 'gray' : 'white'}
          />
        )}
        {title !== 'Register' && title !== 'Login' && title !== 'Camara' && (
          <Appbar.Content title={title} color="white" />
        )}
        {title === 'Recetas' && (
          <>
            {route?.params?.filteredRecipes?.length !== undefined && (
              <View
                style={{
                  top: -8,
                  right: -13,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 12,
                    fontWeight: 'bold',
                  }}>
                  {route?.params?.filteredRecipes?.length}/{recipes.length}
                </Text>
              </View>
            )}
            <Appbar.Action
              color="white"
              icon={
                route?.params?.showingFilters
                  ? 'filter-menu-outline'
                  : route?.params?.filteredRecipes &&
                    route.params.filteredRecipes.length !== recipes.length
                  ? 'filter-check-outline'
                  : 'filter-outline'
              }
              onPress={() => {
                navigation.setParams({
                  showingFilters: !route?.params?.showingFilters,
                });
              }}
            />
          </>
        )}
        {title === 'Camara' && getRecipesButtonVisible ? (
          <FloatingSearchBeveragesButton onPress={getRecipes} />
        ) : null}
      </Appbar.Header>
    </>
  );
}

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: '#03071E',
  },
  transparentBackground: {
    backgroundColor: 'transparent',
  },
});
