import * as React from 'react';
import {StyleSheet, View} from 'react-native';
import {Badge, FAB} from 'react-native-paper';

export type FloatingBevaragesButtonProps = {
  number: number;
  onPress: () => void;
};

const FloatingBeveragesButton = ({
  number,
  onPress,
}: FloatingBevaragesButtonProps) => (
  <View>
    <FAB
      icon="card-search-outline"
      color="#FFBA08"
      rippleColor="white"
      label="buscar recetas"
      customSize={55}
      style={styles.fab}
      onPress={onPress}
    />
    <Badge
      size={30}
      style={{
        top: 5,
        right: 10,
        backgroundColor: '#9D0208',
      }}>
      {number}
    </Badge>
  </View>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    top: 0,
    backgroundColor: '#E85D0499',
  },
});

export default FloatingBeveragesButton;
