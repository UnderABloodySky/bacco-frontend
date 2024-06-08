/**
 * Asks for camera permission. Shows camera when permissions granted.
 *
 * @format
 */

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import CameraScreen from './CameraScreen';
import LandingPage from './LandingPage';
import RecipesScreen from './RecipesScreen';
import RecipeDetailScreen from './RecipeDetailScreen';
import DetailScreen from './DetailScreen';
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        // @ts-ignore
        header: NavBar,
      }}>
      <Stack.Screen
        name="Landing"
        component={LandingPage}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Camara" component={CameraScreen} />
      <Stack.Screen name="Recetas" component={RecipesScreen} />
      <Stack.Screen name="Receta" component={RecipeDetailScreen} />
      <Stack.Screen name="Detalle" component={DetailScreen} />
    </Stack.Navigator>
  );
}

export default App;
