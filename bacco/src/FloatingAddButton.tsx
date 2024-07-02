import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';

export type FloatingAddButtonProps = {
  onPress: () => void;
};

const FloatingAddButton = ({onPress}: FloatingAddButtonProps) => (
  <View>
    <FAB
      icon="plus-thick"
      color="#03071E"
      rippleColor="white"
      customSize={56}
      style={styles.fab}
      onPress={onPress}
    />
  </View>
);

const styles = StyleSheet.create({
  fab: {
    borderRadius: 17,
    marginHorizontal: 5,
    backgroundColor: '#fafafaAA',
  },
});

export default FloatingAddButton;
