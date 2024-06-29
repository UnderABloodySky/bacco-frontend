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
    // const response = await fetch(url, request);
    // const bodyResponse = await response.json();
    const bodyResponse = [
      {
        id: 61,
        name: 'Aperitivo, cerveza y Fernet',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 0,
              name: 'FERNET',
              description: 'El sabor auténtico de Cordoba y Argentina',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 5,
          },
          {
            beverage: {
              id: 6,
              name: 'APERITIVO',
              description: 'El toque perfecto antes de la cena',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 4,
          },
          {
            beverage: {
              id: 5,
              name: 'CERVEZA',
              description: 'La tradición en cada burbuja',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 3,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 17,
              name: 'AZUCAR',
              description: 'Dulzura exquisita para deleitar tus sentidos',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 9,
          },
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 8,
          },
          {
            ingredient: {
              id: 59,
              name: 'HIBISCUS',
              description: 'Roja como la sangre',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 7,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 63,
        name: 'Fernet',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 2,
              name: 'COCACOLA',
              description: 'La chispa que necesitas',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 14,
          },
          {
            beverage: {
              id: 0,
              name: 'FERNET',
              description: 'El sabor auténtico de Cordoba y Argentina',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 13,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 15,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 72,
        name: 'Cosa Rara y Fea',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 4,
              name: 'RON',
              description: 'Una aventura caribeña en tu vaso',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 27,
          },
          {
            beverage: {
              id: 3,
              name: 'GIN',
              description: 'La chispa que necesitas',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 26,
          },
          {
            beverage: {
              id: 2,
              name: 'COCACOLA',
              description: 'La chispa que necesitas',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 25,
          },
          {
            beverage: {
              id: 0,
              name: 'FERNET',
              description: 'El sabor auténtico de Cordoba y Argentina',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 24,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 28,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 73,
        name: 'Cosa Fea',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 4,
              name: 'RON',
              description: 'Una aventura caribeña en tu vaso',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 65,
          },
          {
            beverage: {
              id: 0,
              name: 'FERNET',
              description: 'El sabor auténtico de Cordoba y Argentina',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 30,
          },
          {
            beverage: {
              id: 5,
              name: 'CERVEZA',
              description: 'La tradición en cada burbuja',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 29,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 66,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 60,
        name: 'Solo aperitivo',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 6,
              name: 'APERITIVO',
              description: 'El toque perfecto antes de la cena',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 0,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 2,
          },
          {
            ingredient: {
              id: 13,
              name: 'PIMIENTA',
              description: 'Toque de intensidad y sabor',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 1,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 62,
        name: 'Aperitivo y cerveza',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 6,
              name: 'APERITIVO',
              description: 'El toque perfecto antes de la cena',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 11,
          },
          {
            beverage: {
              id: 5,
              name: 'CERVEZA',
              description: 'La tradición en cada burbuja',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 10,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 12,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 64,
        name: 'Gin Tonic',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 1,
              name: 'TONICA',
              description: 'Refrescante y versátil',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 17,
          },
          {
            beverage: {
              id: 3,
              name: 'GIN',
              description: 'La chispa que necesitas',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 16,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 29,
              name: 'PEPINO',
              description: 'Refrescante y crujiente',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 19,
          },
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 18,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 65,
        name: 'Cuba Libre',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 4,
              name: 'RON',
              description: 'Una aventura caribeña en tu vaso',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 21,
          },
          {
            beverage: {
              id: 2,
              name: 'COCACOLA',
              description: 'La chispa que necesitas',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 20,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 23,
          },
          {
            ingredient: {
              id: 27,
              name: 'LIMON',
              description: 'Acidez refrescante y cítrica',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 22,
          },
        ],
        comments: [],
        ratings: [],
      },
      {
        id: 74,
        name: 'Michelada',
        description:
          '“Ebis vendae eaqui solupta turera prepe parum ut estrum, cus as nient aut aut pa nost, consed ut reroribus ex ea dolor as secestrum qui con preprae sequam ipsaeperum is ipsamus aectibustior accae perovit quas as modipsunt ut volorro beatemolenis veremporum quianda perchil es quam eum',
        user: null,
        imagePath:
          'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/recipe/recipe.jpg',
        beverages: [
          {
            beverage: {
              id: 5,
              name: 'CERVEZA',
              description: 'La tradición en cada burbuja',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/beverage/beverage.jpg',
            },
            measure: 1,
            id: 67,
          },
        ],
        ingredients: [
          {
            ingredient: {
              id: 27,
              name: 'LIMON',
              description: 'Acidez refrescante y cítrica',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 68,
          },
          {
            ingredient: {
              id: 14,
              name: 'HIELO',
              description: 'Frescura garantizada en cada sorbo',
              imagePath:
                'https://raw.githubusercontent.com/UnderABloodySky/bacco-backend/dev/assets/imgs/ingredient/ingredient.jpg',
            },
            quantity: 1,
            id: 69,
          },
        ],
        comments: [],
        ratings: [],
      },
    ];
    // console.log('getRecipes, bodyResponse: ', JSON.stringify(bodyResponse));
    navigation.navigate('Recetas', {
      beverages: beverages,
      ingredients: ingredients,
      recipes: bodyResponse,
      navBarTitle: 'Resultado de Recetas',
    });
  }, [beverages, ingredients, navigation]);

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
