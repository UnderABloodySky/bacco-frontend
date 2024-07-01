import React, {useCallback, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Chip} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
// @ts-ignore
import capitalize from 'lodash/capitalize';
import Searchbox from './Searchbox';
import CustomBanner from './CustomBanner';
import CustomListAccordion from './CustomListAccordion';

type RecipesFilterProps = {
  visible: boolean;
};

const RecipesFilter = ({visible}: RecipesFilterProps) => {
  const route = useRoute();
  const navigation = useNavigation();

  // Access navigation params from route.params
  const {
    beverages,
    ingredients,
    recipes,
    recipeSearchText: paramRecipeSearchText,
    selectedBeverages: paramSelectedBeverages,
    selectedIngredients: paramSelectedIngredients,
    filteredRecipes: paramFilteredRecipes,
  } = route.params;

  const initialRecipeSearchText = paramRecipeSearchText || '';
  const initialSelectedBeverages = paramSelectedBeverages || [];
  const initialSelectedIngredients = paramSelectedIngredients || [];

  const [selectedIngredients, setSelectedIngredients] = useState(
    initialSelectedIngredients,
  );
  const [selectedBeverages, setSelectedBeverages] = useState(
    initialSelectedBeverages,
  );
  const [recipeSearchText, setRecipeSearchText] = useState(
    initialRecipeSearchText,
  );

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
      const hasNoSelectedFilters =
        !selectedIngredients.length && !selectedBeverages.length;
      const matchesSearchText = recipe.name
        .toLowerCase()
        .includes(recipeSearchText.toLowerCase());
      return (
        (hasNoSelectedFilters ||
          hasMatchingIngredient ||
          hasMatchingBeverage) &&
        matchesSearchText
      );
    });
    return matchingRecipes;
  }, [recipes, recipeSearchText, selectedBeverages, selectedIngredients]);

  const isApplyEnabled = useMemo(
    () =>
      selectedIngredients.length ||
      selectedBeverages.length ||
      recipeSearchText,
    [recipeSearchText, selectedBeverages.length, selectedIngredients.length],
  );

  const isResetEnabled = useMemo(
    () =>
      paramFilteredRecipes && paramFilteredRecipes.length !== recipes.length,
    [paramFilteredRecipes, recipes.length],
  );

  const resetFilters = () => {
    setSelectedIngredients([]);
    setSelectedBeverages([]);
    setRecipeSearchText('');
    navigation.setParams({
      selectedIngredients: [],
      selectedBeverages: [],
      recipeSearchText: '',
      filteredRecipes: null,
      showingFilters: false,
    });
  };

  const applyFilters = () => {
    navigation.setParams({
      selectedIngredients,
      selectedBeverages,
      recipeSearchText,
      filteredRecipes,
    });
  };

  return (
    <CustomBanner
      style={{
        backgroundColor: '#D2C3C3',
        maxHeight: '35%',
        // borderBottomLeftRadius: 15,
        // borderBottomRightRadius: 15,
      }}
      contentStyle={{
        // backgroundColor: '#D2C3C3',
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
      }}
      visible={visible}>
      <View style={styles.container}>
        <Searchbox
          placeholder="Filtra recetas por su nombre"
          onChangeText={setRecipeSearchText}
          style={{backgroundColor: '#F2F2F2'}}
          text={recipeSearchText}
        />
        {!!ingredients.length && (
          <>
            <View style={{height: 10}} />
            <CustomListAccordion
              style={{
                paddingVertical: 0,
                backgroundColor: '#F2F2F2',
                borderRadius: 50,
              }}
              title="Filtra por Ingredientes">
              <View style={[styles.listContainer]}>
                {ingredients.map(ingredient => (
                  <Chip
                    key={ingredient}
                    disabled={isIngredientDisabled(ingredient)}
                    selected={isIngredientSelected(ingredient)}
                    style={styles.buttonWrapper}
                    // selectedColor="#F0E2CA"
                    onPress={() => {
                      toggleIngredientSelection(ingredient);
                    }}>
                    {capitalize(ingredient)}
                  </Chip>
                ))}
              </View>
            </CustomListAccordion>
          </>
        )}
        {!!beverages.length && (
          <>
            <View style={{height: 10}} />
            <CustomListAccordion
              style={{
                paddingVertical: 0,
                backgroundColor: '#F2F2F2',
                borderRadius: 50,
              }}
              title="Filtra por Bebidas">
              <View style={[styles.listContainer]}>
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
            </CustomListAccordion>
          </>
        )}
        <View
          style={{
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <Button
            mode="contained"
            icon="undo-variant"
            disabled={!isResetEnabled}
            labelStyle={{ color: '#fafafa'}}
            style={
              !isResetEnabled
                ? {backgroundColor: 'gray', opacity: 0.6}
                : {backgroundColor: 'black'}
            }
            onPress={resetFilters}>
            Resetear filtros
          </Button>
          <Button
            mode="contained"
            icon="check-circle-outline"
            disabled={!isApplyEnabled}
            labelStyle={{ color: '#fafafa'}}
            style={
              !isApplyEnabled
                ? {backgroundColor: 'gray', opacity: 0.6}
                : {backgroundColor: 'black'}
            }
            onPress={applyFilters}>
            Aplicar filtros
          </Button>
        </View>
      </View>
    </CustomBanner>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#03071ECC',
    padding: 10,
  },
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
  listContainer: {
    // flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    paddingTop: 10,
    // padding: 10,
  },
  buttonWrapper: {
    // minWidth: '30%', // Adjust the width percentage to fit the number of buttons per row
    margin: 5,
    backgroundColor: '#F0E2CA',
    // color: 'white',
  },
});

export default RecipesFilter;
