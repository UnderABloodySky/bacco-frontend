import * as React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

export type LandingCardProps = {
  onPressScanButton: () => void;
};

const LandingCard = ({onPressScanButton}: LandingCardProps) => (
  <Card elevation={5} style={styles.container}>
    <Card.Content style={styles.textContainer}>
      <Text variant="titleLarge" style={styles.text}>
        Escanea tus bebidas y
      </Text>
      <Text variant="titleLarge" style={styles.text}>
        arma los mejores tragos!
      </Text>
    </Card.Content>
    <View style={styles.scanButtonContainer}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPressScanButton}
        disabled={!onPressScanButton}>
        <View style={styles.scanButton}>
          <Icon name="scan-circle-outline" size={45} color="#111" />
        </View>
      </TouchableOpacity>
    </View>
  </Card>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#03071EAA',
  },
  text: {
    color: '#FFF',
  },
  textContainer: {
    alignItems: 'center',
  },
  scanButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0E2CA',
    borderRadius: 100,
    paddingVertical: 5,
  },
  scanButtonContainer: {
    padding: 8,
    width: 100,
    alignSelf: 'center',
  },
});

export default LandingCard;
