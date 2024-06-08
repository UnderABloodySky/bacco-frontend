import * as React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

import FloatingAddButton from './FloatingAddButton';

export type FloatingBeveragesListProps = {
  beverages: string[];
  ingredients: string[];
  onPressBevarage: (beverage: string) => void;
  onPressIngredient: (ingredient: string) => void;
  onRemoveBeverage: (beverage: string) => void;
  onRemoveIngredient: (ingredient: string) => void;
  onAddIngredientPress: () => void;
};

interface BeveragesIconsMap {
  [key: string]: string;
}

export const beveragesIconsMap: BeveragesIconsMap = {
  fernet: 'glass-mug-variant',
  gancia: 'glass-cocktail',
  licor: 'glass-mug',
  ron: 'glass-stange',
  vino: 'glass-wine',
  whiskey: 'glass-pint-outline',
};

const FloatingBeveragesList = ({
  beverages,
  ingredients,
  onPressBevarage = () => {},
  onPressIngredient = () => {},
  onRemoveBeverage = () => {},
  onRemoveIngredient = () => {},
  onAddIngredientPress = () => {},
}: FloatingBeveragesListProps) => {
  return (
    <ScrollView horizontal style={styles.fab}>
      <FloatingAddButton onPress={onAddIngredientPress} />
      {ingredients.map((ingredient, index) => (
        <TouchableOpacity
          key={'ingredient-' + index}
          activeOpacity={0.6}
          onPress={() => {
            onPressIngredient(ingredient);
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onRemoveIngredient(ingredient)}
            style={styles.removeButton}>
            <IconMC name="close-thick" size={17} color="#03071E" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <IconMC name={'fruit-cherries'} size={32} color="#fafafa" />
          </View>
          <View style={styles.nameContainer}>
            <Text numberOfLines={1} style={styles.name}>
              {ingredient.toLocaleUpperCase()}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      {beverages.map((beverage, index) => (
        <TouchableOpacity
          key={'beverage-' + index}
          activeOpacity={0.6}
          onPress={() => {
            onPressBevarage(beverage);
          }}>
          <TouchableOpacity
            activeOpacity={0.6}
            onPress={() => onRemoveBeverage(beverage)}
            style={styles.removeButton}>
            <IconMC name="close-thick" size={17} color="#03071E" />
          </TouchableOpacity>
          <View style={styles.iconContainer}>
            <IconMC
              name={beveragesIconsMap[beverage] || 'cup'}
              size={32}
              color="#fafafa"
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{beverage.toLocaleUpperCase()}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 5,
    top: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#fafafa',
    borderRadius: 100,
    zIndex: 100,
  },
  iconContainer: {
    backgroundColor: '#03071E99',
    borderRadius: 17,
    padding: 12,
    marginHorizontal: 5,
    width: 56,
  },
  name: {
    borderRadius: 100,
    backgroundColor: '#03071E99',
    fontSize: 10,
    textAlign: 'center',
    color: '#fafafa',
    fontWeight: 'bold',
  },
  nameContainer: {
    paddingTop: 2,
    width: 56,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  spacer: {
    width: 10,
  },
});

export default FloatingBeveragesList;
