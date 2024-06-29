import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Chip, Divider, Icon, Text} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
// @ts-ignore
import capitalize from 'lodash/capitalize';
import Searchbox from './Searchbox';

const FilterScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const initialSelectedIngredients = route?.params?.selectedIngredients || [];
  const initialSelectedBeverages = route?.params?.selectedBeverages || [];
  const initialRecipeSearchText = route?.params?.recipeSearchText || '';

  const [selectedIngredients, setSelectedIngredients] = useState(initialSelectedIngredients);
  const [selectedBeverages, setSelectedBeverages] = useState(initialSelectedBeverages);
  const [recipeSearchText, setRecipeSearchText] = useState(initialRecipeSearchText);

  // Access navigation params from route.params
  const {beverages, ingredients, recipes} = route.params;

  const recipesIngredients = useMemo(() => {
    return recipes.flatMap(
      recipe =>
        recipe.ingredients?.map(ingredient =>
          ingredient.ingredient.name.toLowerCase(),
        ) || [],
    );
  }, [recipes]);

  const recipesBeverages = useMemo(() => {
    return recipes.flatMap(
      recipe =>
        recipe.beverages?.map(beverage =>
          beverage.beverage.name.toLowerCase(),
        ) || [],
    );
  }, [recipes]);

  const isIngredientDisabled = useCallback(
    ingredient => {
      return !recipesIngredients.includes(ingredient);
    },
    [recipesIngredients],
  );

  const isBeverageDisabled = useCallback(
    ingredient => {
      return !recipesBeverages.includes(ingredient);
    },
    [recipesBeverages],
  );

  const isIngredientSelected = useCallback(
    ingredient => selectedIngredients.includes(ingredient),
    [selectedIngredients],
  );

  const isBeverageSelected = useCallback(
    beverage => selectedBeverages.includes(beverage),
    [selectedBeverages],
  );

  const toggleIngredientSelection = useCallback(
    ingredient => {
      setSelectedIngredients(prevSelectedIngredients => {
        if (prevSelectedIngredients.includes(ingredient)) {
          return prevSelectedIngredients.filter(
            selectedIngredient => selectedIngredient !== ingredient,
          );
        }
        return [...prevSelectedIngredients, ingredient];
      });
    },
    [setSelectedIngredients],
  );

  const toggleBeverageSelection = useCallback(
    beverage => {
      setSelectedBeverages(prevSelectedBeverages => {
        if (prevSelectedBeverages.includes(beverage)) {
          return prevSelectedBeverages.filter(
            selectedBeverage => selectedBeverage !== beverage,
          );
        }
        return [...prevSelectedBeverages, beverage];
      });
    },
    [setSelectedBeverages],
  );

  const filteredRecipes = useMemo(() => {
    const matchingRecipes = recipes.filter(recipe => {
      const hasMatchingIngredient = recipe.ingredients?.some(ingredient =>
        selectedIngredients.includes(ingredient.ingredient.name.toLowerCase()),
      );
      const hasMatchingBeverage = recipe.beverages?.some(beverage =>
        selectedBeverages.includes(beverage.beverage.name.toLowerCase()),
      );
      return (
        (hasMatchingIngredient || hasMatchingBeverage) &&
        recipe.name.toLowerCase().includes(recipeSearchText.toLowerCase())
      );
    });
    // if (navigation) {
    //   navigation.setParams({
    //     selectedIngredients,
    //     selectedBeverages,
    //     recipeSearchText,
    //     filteredRecipes: matchingRecipes,
    //   });
    // }
    return matchingRecipes;
  }, [
    // navigation,
    recipes,
    recipeSearchText,
    selectedBeverages,
    selectedIngredients,
  ]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#D2C3C3',
        padding: 10,
      }}>
      <Searchbox
        placeholder="Busca recetas por su nombre"
        onChangeText={setRecipeSearchText}
        text={recipeSearchText}
      />
      <View style={{marginTop: 10}}>
        <Text variant="labelLarge">Resultado:</Text>
        {
          <View style={[styles.container]}>
            {filteredRecipes.map(recipe => (
              <View
                key={recipe.id}
                style={[styles.buttonWrapper, {backgroundColor: '#F0E2CA99'}]}>
                <Icon source="script-text-outline" size={25} />
                <Text variant="labelSmall" numberOfLines={1}>
                  {recipe.name}
                </Text>
              </View>
            ))}
          </View>
        }
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
        Filtrar por Ingredientes
      </Text>
      <View style={[styles.container]}>
        {ingredients.map(ingredient => (
          <Chip
            key={ingredient}
            disabled={isIngredientDisabled(ingredient)}
            selected={isIngredientSelected(ingredient)}
            style={styles.buttonWrapper}
            onPress={() => {
              toggleIngredientSelection(ingredient);
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
            disabled={isBeverageDisabled(beverage)}
            selected={isBeverageSelected(beverage)}
            style={styles.buttonWrapper}
            onPress={() => {
              toggleBeverageSelection(beverage);
            }}>
            {capitalize(beverage)}
          </Chip>
        ))}
      </View>
      <Button
        style={{marginTop: 25}}
        mode="contained"
        onPress={() => {
          navigation.navigate('Recetas', {
            ...(route?.params || {}),
            selectedIngredients,
            selectedBeverages,
            recipeSearchText,
            filteredRecipes,
            navBarTitle: 'Resultado de Recetas',
          });
        }}>
        Confirmar filtrado
      </Button>
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
