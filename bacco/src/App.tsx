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
import NavBar from './NavBar';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <Stack.Navigator
      initialRouteName="Landing"
      screenOptions={{
        header: NavBar,
      }}>
      <Stack.Screen
        name="Landing"
        component={LandingPage}
        options={{headerShown: false}}
      />
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Recipes" component={RecipesScreen} />
    </Stack.Navigator>
  );
}

export default App;
