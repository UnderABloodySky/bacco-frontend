import * as React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Card, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

export type LandingCardProps = {
  onPressScanButton: () => void;
};

const LandingCard = ({onPressScanButton}: LandingCardProps) => (
  <Card
    elevation={5}
    style={{
      backgroundColor: '#6A040F99',
    }}>
    <Card.Content
      style={{
        alignItems: 'center',
      }}>
      <Text
        variant="titleLarge"
        style={{
          color: '#FFBA08',
        }}>
        Escanea tus bebidas y
      </Text>
      <Text
        variant="titleLarge"
        style={{
          color: '#FFBA08',
        }}>
        arma los mejores tragos!
      </Text>
    </Card.Content>
    <View
      style={{
        padding: 8,
        width: 120,
        alignSelf: 'center',
      }}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={onPressScanButton}
        disabled={!onPressScanButton}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#370617',
            borderRadius: 100,
            paddingVertical: 5,
          }}>
          <Icon name="scan-circle-outline" size={45} color="#FFBA08" />
        </View>
      </TouchableOpacity>
    </View>
  </Card>
);

export default LandingCard;
