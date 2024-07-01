import React, {useState} from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  Card,
  Divider,
  FAB,
  Icon,
  Text as PaperText,
  TouchableRipple,
} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
// @ts-ignore
import capitalize from 'lodash/capitalize';

import Comments from './Comments';
import {useEffect} from 'react';

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
  const color = hasAll ? '#111' : '#fff';
  return (
    <View>
      <FAB
        icon={icon}
        label={label}
        color={color}
        customSize={30}
        style={[styles.countBadge, hasAll && styles.fabHasAll]}
      />
    </View>
  );
};

const FloatingTouchIcon = () => (
  <View style={[styles.fab, styles.fabHasAll]}>
    <View style={styles.tapIcon}>
      <Icon source="gesture-tap" color="#111" size={28} />
    </View>
  </View>
);

const RecipeDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {recipe} = route.params;
  const windowHeight = Dimensions.get('window').height;

  const [comments, setComments] = useState([]);

  const fetchRecipeDetail = async recipeId => {
    const url = `http://localhost:8080/imgs/recipe/${recipeId}`;
    const headers = {
      Accept: 'application/json',
    };
    const request = {
      method: 'GET',
      headers: headers,
    };
    const response = await fetch(url, request);
    const bodyResponse = await response.json();
    if (bodyResponse?.comments.length) {
      const mappedCommentsWithUserId = bodyResponse.comments.map(comment => ({
        ...comment,
        userId: comment.user.id,
      }));
      setComments(mappedCommentsWithUserId);
    }
  };

  useEffect(() => {
    if (recipe?.id) {
      fetchRecipeDetail(recipe.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          src={recipe.imagePath}
          style={windowHeight ? {height: windowHeight * 0.7} : null}
          resizeMode="cover"
        />
        <View style={styles.dataContainer}>
          <View style={styles.recipeInfoContainer}>
            <Text style={styles.recipeName}>{recipe.name}</Text>
            <View style={styles.recipeDescriptionContainer}>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
            </View>
          </View>
          <Divider bold />
          <View style={styles.entityListContainer}>
            <View style={styles.entityListHeaderContainer}>
              <Text style={styles.entityListHeader}>Listado de Bebidas</Text>
              <FloatingCountBadge
                actual={recipe.beveragesActual}
                total={recipe.beveragesTotal}
              />
            </View>
            {recipe.beverages.map(beverage => (
              <TouchableRipple
                borderless
                style={styles.entityCardContainer}
                onPress={() => {
                  navigation.navigate('Detalle', {
                    ...(route?.params || {}),
                    beverage: beverage.beverage,
                    navBarTitle: 'Detalle de Bebida',
                  });
                }}
                rippleColor="rgba(0, 0, 0, .32)">
                <>
                  <FloatingTouchIcon />
                  <Card
                    // eslint-disable-next-line react-native/no-inline-styles
                    contentStyle={{
                      ...styles.entityCard,
                      opacity: beverage.matched ? 1 : 0.7,
                    }}>
                    <Card.Cover src={beverage.beverage.imagePath} />
                    <Card.Title
                      title={capitalize(beverage.beverage.name)}
                      titleVariant="titleMedium"
                    />
                    <Card.Content>
                      <PaperText variant="bodyMedium" numberOfLines={2}>
                        {beverage.beverage.description}
                      </PaperText>
                      <Divider bold style={styles.divider} />
                      <PaperText variant="bodyMedium" numberOfLines={2}>
                        Medidas: {beverage.measure}
                      </PaperText>
                    </Card.Content>
                  </Card>
                </>
              </TouchableRipple>
            ))}
          </View>
          <Divider bold />
          <View style={styles.entityListContainer}>
            <View style={styles.entityListHeaderContainer}>
              <Text style={styles.entityListHeader}>
                Listado de Ingredientes
              </Text>
              <FloatingCountBadge
                actual={recipe.ingredientsActual}
                total={recipe.ingredientsTotal}
                isIngredientsBadge
              />
            </View>
            {recipe.ingredients.map(ingredient => (
              <TouchableRipple
                borderless
                style={styles.entityCardContainer}
                onPress={() => {
                  navigation.navigate('Detalle', {
                    ...(route?.params || {}),
                    ingredient: ingredient.ingredient,
                    navBarTitle: 'Detalle de Ingrediente',
                  });
                }}
                rippleColor="rgba(0, 0, 0, .32)">
                <>
                  <FloatingTouchIcon />
                  <Card
                    // eslint-disable-next-line react-native/no-inline-styles
                    contentStyle={{
                      ...styles.entityCard,
                      opacity: ingredient.matched ? 1 : 0.7,
                    }}>
                    <Card.Cover src={ingredient.ingredient.imagePath} />
                    <Card.Title
                      title={capitalize(ingredient.ingredient.name)}
                      titleVariant="titleMedium"
                    />
                    <Card.Content>
                      <PaperText variant="bodyMedium" numberOfLines={2}>
                        {ingredient.ingredient.description}
                      </PaperText>
                      <Divider bold style={styles.divider} />
                      <PaperText variant="bodyMedium" numberOfLines={2}>
                        Cantidad: {ingredient.quantity}
                      </PaperText>
                    </Card.Content>
                  </Card>
                </>
              </TouchableRipple>
            ))}
          </View>
          <Divider bold />
          <View style={styles.entityListContainer}>
            <Text style={styles.entityListHeader}>
              Comentarios
            </Text>
          </View>
          <Comments comments={comments} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03071E',
  },
  dataContainer: {
    paddingHorizontal: 20,
  },
  recipeInfoContainer: {
    marginVertical: 20,
  },
  recipeName: {
    color: 'white',
    fontSize: 22,
    lineHeight: 28,
    minHeight: 30,
  },
  recipeDescription: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  recipeDescriptionContainer: {
    marginTop: 10,
  },
  countBadge: {
    borderRadius: 17,
    backgroundColor: '#fafafa99',
  },
  fab: {
    position: 'absolute',
    borderRadius: 30,
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 6,
    backgroundColor: '#fafafa99',
  },
  tapIcon: {
    bottom: 3,
  },
  fabHasAll: {
    backgroundColor: '#F7F3F9',
  },
  divider: {
    backgroundColor: '#111',
  },
  entityCard: {
    backgroundColor: '#F0E2CA',
    borderRadius: 12,
  },
  entityCardContainer: {
    marginVertical: 10,
    borderRadius: 12,
  },
  entityListHeader: {
    color: 'white',
    fontSize: 18,
  },
  entityListHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  entityListContainer: {
    paddingVertical: 20,
  },
});

export default RecipeDetailScreen;
