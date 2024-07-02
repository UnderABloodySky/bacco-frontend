/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {MD3LightTheme as DefaultTheme, PaperProvider} from 'react-native-paper';
import {name as appName} from './app.json';
import App from './src/App';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#111',
    secondary: 'white',
  },
};

const Main = () => (
  <NavigationContainer>
    <PaperProvider theme={theme}>
      <App />
    </PaperProvider>
  </NavigationContainer>
);

AppRegistry.registerComponent(appName, () => Main);
