import React, {useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Card, FAB, Icon, TouchableRipple} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
// @ts-ignore
import capitalize from 'lodash/capitalize';
import RecipesFilter from './RecipesFilter';

type FloatingCountBadgeProps = {
  actual: number;
  total: number;
  entities: any[];
  isIngredientsBadge?: boolean;
};

const FloatingBadge = ({
  actual,
  total,
  entities,
  isIngredientsBadge = false,
}: FloatingCountBadgeProps) => {
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isIconsDisplay, setIsIconsDisplay] = useState(false);

  const icon = isIngredientsBadge ? 'fruit-cherries' : 'glass-cocktail';

  if (isIconsDisplay) {
    const missingAmount = total - actual;
    return (
      <View
        style={[
          {
            position: 'absolute',
            top: 11,
            left: 12,
            flexDirection: 'row',
            zIndex: 10,
          },
          isIngredientsBadge && styles.longPressIconForIngredients,
        ]}>
        <FAB
          icon="close-circle-outline"
          color="white"
          customSize={35}
          onPress={() => {
            setIsIconsDisplay(false);
          }}
          style={[
            {
              backgroundColor: '#03071E55',
              marginRight: 15,
              borderRadius: 25,
            },
          ]}
        />
        {Array.from({length: missingAmount}, (_, i) => (
          <View
            key={`${i}-missing`}
            style={{
              padding: 5,
              marginRight: 5,
              backgroundColor: 'rgba(128, 128, 128, 0.8)',
              borderRadius: 25,
            }}>
            <Icon
              source={`${icon}-off`}
              color="rgba(255, 255, 255, 0.85)"
              size={25}
            />
          </View>
        ))}
        <View
          style={{
            width: missingAmount ? 12 : 0,
          }}
        />
        {Array.from({length: actual}, (_, i) => (
          <View
            key={`${i}-actual`}
            style={{
              padding: 5,
              marginRight: 5,
              backgroundColor: 'rgba(128, 128, 128, 1)',
              borderRadius: 25,
            }}>
            <Icon source={`${icon}`} color="rgba(255, 255, 255, 1)" size={25} />
          </View>
        ))}
      </View>
    );
  }

  const missingEntities = entities
    ?.filter(entity => !entity.matched)
    .map(entity =>
      capitalize(
        isIngredientsBadge ? entity?.ingredient?.name : entity?.beverage?.name,
      ),
    );
  const matchedEntities = entities
    ?.filter(entity => entity.matched)
    .map(entity =>
      capitalize(
        isIngredientsBadge ? entity?.ingredient?.name : entity?.beverage?.name,
      ),
    );

  const label = `${actual}/${total}`;
  const hasAll = actual === total;
  return (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.longPressIcon,
          isIngredientsBadge && styles.longPressIconForIngredients,
        ]}>
        <Icon source="gesture-tap-hold" color="#111" size={25} />
      </View>
      <FAB
        icon={icon}
        label={label}
        color="#111"
        customSize={35}
        onPress={() => {
          setIsIconsDisplay(true);
        }}
        onLongPress={() => {
          if (!isHintVisible) {
            setIsHintVisible(true);
            setTimeout(() => {
              setIsHintVisible(false);
            }, 2500);
          }
        }}
        style={[
          styles.fab,
          isIngredientsBadge && styles.fabIngredientsPosition,
          hasAll && styles.fabHasAll,
        ]}
      />
      {isHintVisible && (
        <View
          style={{
            position: 'absolute',
            top: 95,
            right: 10,
            width: 350,
            borderRadius: 5,
            minHeight: 80,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 5,
            zIndex: 10,
          }}>
          <Text
            style={{
              color: 'white',
              opacity: 0.85,
              fontSize: 16,
              display: missingEntities.length ? 'flex' : 'none',
            }}>{`Faltantes: ${missingEntities.join(', ')}`}</Text>
          <Text
            style={{
              color: 'white',
              fontSize: 16,
              display: matchedEntities.length ? 'flex' : 'none',
            }}>{`Actuales: ${matchedEntities.join(', ')}`}</Text>
        </View>
      )}
    </>
  );
};

const Footer = () => <View style={styles.footer} />;

const RecipesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  // Access navigation params from route.params
  const {beverages, filteredRecipes, ingredients, recipes, showingFilters} =
    route.params;

  const sortedRecipes = (filteredRecipes || recipes)
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

  return filteredRecipes || recipes ? (
    <>
      <RecipesFilter visible={showingFilters} />
      <FlatList
        data={sortedRecipes}
        style={styles.recipeList}
        ListFooterComponent={Footer}
        renderItem={({item: recipe}) => (
          <TouchableRipple
            borderless
            style={styles.recipeContainer}
            onPress={() => {
              navigation.navigate('Receta', {
                ...(route?.params || {}),
                recipe: recipe,
                navBarTitle: 'Detalle de Receta',
              });
            }}
            rippleColor="rgba(0, 0, 0, .32)">
            <>
              <FloatingBadge
                actual={recipe.beveragesActual}
                total={recipe.beveragesTotal}
                entities={recipe.beverages}
              />
              <FloatingBadge
                actual={recipe.ingredientsActual}
                total={recipe.ingredientsTotal}
                entities={recipe.ingredients}
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
                  <MaskedView
                    maskElement={
                      <Text
                        numberOfLines={3}
                        style={[
                          styles.recipeDescriptionText,
                          styles.descriptionMask,
                        ]}>
                        {recipe.description}
                      </Text>
                    }>
                    <LinearGradient
                      colors={[
                        'rgba(255, 255, 255, 0.2)',
                        'rgba(255, 255, 255, 1)',
                      ]}
                      start={{x: 0, y: 1}}
                      end={{x: 0, y: 0}}>
                      <Text
                        numberOfLines={3}
                        style={[
                          styles.recipeDescriptionText,
                          styles.invisible,
                        ]}>
                        {recipe.description}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                </Card.Content>
              </Card>
            </>
          </TouchableRipple>
        )}
        keyExtractor={recipe => recipe.id.toString()}
      />
    </>
  ) : null;
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
});

export default RecipesScreen;
