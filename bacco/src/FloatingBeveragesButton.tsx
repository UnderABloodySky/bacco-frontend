import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';

export type FloatingBevaragesButtonProps = {
  onPress: () => void;
};

const FloatingBeveragesButton = ({onPress}: FloatingBevaragesButtonProps) => (
  <View>
    <FAB
      icon="card-search-outline"
      color="#111"
      rippleColor="white"
      label="Buscar Recetas"
      customSize={42}
      style={styles.fab}
      onPress={onPress}
    />
  </View>
);

const styles = StyleSheet.create({
  fab: {
    marginRight: 5,
    backgroundColor: '#F0E2CA',
  },
});

export default FloatingBeveragesButton;
