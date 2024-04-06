import React from 'react';
import {Appbar} from 'react-native-paper';

export default function NavBar({navigation, route, options, back = false}) {
  return (
    <Appbar.Header
      style={{
        backgroundColor: '#03071E',
      }}>
      {back ? (
        <Appbar.BackAction onPress={navigation.goBack} color="white" />
      ) : null}
    </Appbar.Header>
  );
}
