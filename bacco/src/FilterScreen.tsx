import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Chip, Divider, Icon, Text, TouchableRipple} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
// @ts-ignore
import capitalize from 'lodash/capitalize';
import Searchbox from './Searchbox';

const FilterScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Access navigation params from route.params
  const {beverages, ingredients, recipes} = route.params;
  console.log('🎁 🎁 beverages: ', beverages);
  console.log('🎁 🎁🎁ingredients: ', ingredients);
  console.log('🎁🎁 🎁recipes: ', recipes);

  const sortedRecipes = recipes
    .map(recipe => {
      const beveragesTotal = recipe.beverages?.length || 0;
      const beveragesActual =
        recipe.beverages?.filter(beverage =>
          beverages.includes(beverage?.beverage?.name?.toLowerCase()),
        )?.length || 0;
      const beveragesMapped = recipe.beverages
        ?.map(beverage => ({
          ...beverage,
          matched: beverages.includes(beverage?.beverage?.name?.toLowerCase()),
        }))
        .sort(beverageA => (beverageA.matched ? 1 : -1));
      const ingredientsTotal = recipe.ingredients?.length || 0;
      const ingredientsActual =
        recipe.ingredients?.filter(ingredient =>
          ingredients.includes(ingredient?.ingredient?.name?.toLowerCase()),
        )?.length || 0;
      const ingredientsMapped = recipe.ingredients
        ?.map(ingredient => ({
          ...ingredient,
          matched: ingredients.includes(
            ingredient?.ingredient?.name?.toLowerCase(),
          ),
        }))
        .sort(ingredientA => (ingredientA.matched ? 1 : -1));
      return {
        ...recipe,
        beverages: beveragesMapped,
        ingredients: ingredientsMapped,
        beveragesTotal,
        beveragesActual,
        ingredientsTotal,
        ingredientsActual,
      };
    })
    .sort((recipeA, recipeB) => {
      const recipeATotal = recipeA.beveragesTotal + recipeA.ingredientsTotal;
      const recipeBTotal = recipeB.beveragesTotal + recipeB.ingredientsTotal;
      const recipeAActual = recipeA.beveragesActual + recipeA.ingredientsActual;
      const recipeBActual = recipeB.beveragesActual + recipeB.ingredientsActual;
      return recipeBTotal - recipeBActual > recipeATotal - recipeAActual
        ? -1
        : 1;
    });

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#D2C3C3',
        padding: 10,
      }}>
      <Searchbox
        placeholder="Busca recetas por su nombre"
        onChangeText={text => {
          console.log('deberia buscar recetas a partir de este nombre: ', text);
        }}
        text={'asdfgh'}
      />
      <Divider
        bold
        style={{
          marginTop: 10,
          backgroundColor: '#111',
        }}
      />
      <Text
        variant="titleLarge"
        style={{
          marginTop: 10,
        }}>
        Filtrar por Ingredientes
      </Text>
      <View style={[styles.container]}>
        {ingredients.map(ingredient => (
          <Chip
            key={ingredient}
            mode="flat"
            style={styles.buttonWrapper}
            onPress={() => {
              console.log('deberia filtrar por este ingrediente: ', ingredient);
            }}>
            {capitalize(ingredient)}
          </Chip>
        ))}
      </View>
      <Divider
        bold
        style={{
          marginTop: 10,
          backgroundColor: '#111',
        }}
      />
      <Text
        variant="titleLarge"
        style={{
          marginTop: 10,
        }}>
        Filtrar por Bebidas
      </Text>
      <View style={[styles.container]}>
        {beverages.map(beverage => (
          <Chip
            key={beverage}
            mode="flat"
            style={styles.buttonWrapper}
            onPress={() => {
              console.log('deberia filtrar por este beverage: ', beverage);
            }}>
            {capitalize(beverage)}
          </Chip>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  longPressIcon: {
    position: 'absolute',
    top: 11,
    right: 12,
    zIndex: 10,
  },
  fab: {
    position: 'absolute',
    borderRadius: 17,
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#fafafa99',
    paddingRight: 5,
  },
  fabIngredientsPosition: {
    top: 52,
  },
  longPressIconForIngredients: {
    top: 53,
  },
  fabHasAll: {
    backgroundColor: '#F7F3F9',
  },
  recipeList: {
    backgroundColor: '#D2C3C3',
  },
  recipeContainer: {
    margin: 20,
    marginBottom: 0,
    borderRadius: 12,
  },
  recipeCard: {
    backgroundColor: '#03071E',
    borderRadius: 12,
  },
  recipeText: {
    color: 'white',
  },
  recipeDescriptionText: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'sans-serif',
    letterSpacing: 0.15,
    lineHeight: 24,
    fontWeight: 'normal',
  },
  descriptionMask: {
    backgroundColor: 'transparent',
  },
  invisible: {
    opacity: 0,
  },
  footer: {
    height: 20,
  },
  container: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    paddingTop: 10,
    // padding: 10,
  },
  buttonWrapper: {
    minWidth: '30%', // Adjust the width percentage to fit the number of buttons per row
    margin: 5,
  },
});

export default FilterScreen;
