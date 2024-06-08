import * as React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {Card, FAB, Text, TouchableRipple} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';

type FloatingCountBadgeProps = {
  actual: number;
  total: number;
  isIngredientsBadge?: boolean;
};

const FloatingCountBadge = ({
  actual,
  total,
  isIngredientsBadge = false,
}: FloatingCountBadgeProps) => {
  const icon = isIngredientsBadge ? 'fruit-cherries' : 'glass-cocktail';
  const label = `${actual}/${total}`;
  const hasAll = actual === total;
  return (
    <FAB
      icon={icon}
      label={label}
      color="#111"
      customSize={35}
      style={[
        styles.fab,
        isIngredientsBadge && styles.fabIngredientsPosition,
        hasAll && styles.fabHasAll,
      ]}
    />
  );
};

const Footer = () => <View style={styles.footer} />;

const RecipesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Access navigation params from route.params
  const {beverages, ingredients, recipes} = route.params;

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

  return recipes ? (
    <FlatList
      data={sortedRecipes}
      style={styles.recipeList}
      ListFooterComponent={Footer}
      renderItem={({item: recipe}) => {
        return (
          <TouchableRipple
            borderless
            style={styles.recipeContainer}
            onPress={() => {
              navigation.navigate('Receta', {
                recipe: recipe,
                navBarTitle: 'Detalle de Receta',
              });
            }}
            rippleColor="rgba(0, 0, 0, .32)">
            <>
              <FloatingCountBadge
                actual={recipe.beveragesActual}
                total={recipe.beveragesTotal}
              />
              <FloatingCountBadge
                actual={recipe.ingredientsActual}
                total={recipe.ingredientsTotal}
                isIngredientsBadge
              />
              <Card contentStyle={styles.recipeCard}>
                <Card.Cover src={recipe.imagePath} />
                <Card.Title
                  title={recipe.name}
                  titleVariant="titleLarge"
                  titleStyle={styles.recipeText}
                />
                <Card.Content>
                  <Text
                    variant="bodyLarge"
                    numberOfLines={2}
                    style={styles.recipeText}>
                    {recipe.description}
                  </Text>
                </Card.Content>
              </Card>
            </>
          </TouchableRipple>
        );
      }}
      keyExtractor={recipe => recipe.id.toString()}
    />
  ) : null;
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    borderRadius: 17,
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: '#fafafa99',
  },
  fabIngredientsPosition: {
    top: 52,
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
  footer: {
    height: 20,
  },
});

export default RecipesScreen;
