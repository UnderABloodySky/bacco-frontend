import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {FAB} from 'react-native-paper';

export type FloatingSearchBeveragesButtonProps = {
  onPress: () => void;
};

const FloatingSearchBeveragesButton = ({onPress}: FloatingSearchBeveragesButtonProps) => (
  <View
    style={{
      right: 10,
      position: 'absolute',
    }}>
    <FAB
      icon="card-search-outline"
      color="#111"
      rippleColor="white"
      customSize={42}
      style={styles.fab}
      onPress={onPress}
    />
  </View>
);

const styles = StyleSheet.create({
  fab: {
    backgroundColor: '#F0E2CA',
  },
});

export default FloatingSearchBeveragesButton;
