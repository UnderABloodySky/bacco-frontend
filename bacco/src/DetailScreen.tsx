import * as React from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
// @ts-ignore
import capitalize from 'lodash/capitalize';

const DetailScreen = () => {
  const route = useRoute();
  // @ts-ignore
  const {beverage, ingredient} = route.params;
  const detailEntity = beverage || ingredient;

  const windowHeight = Dimensions.get('window').height;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Image
          src={detailEntity?.imagePath}
          style={windowHeight ? {height: windowHeight * 0.7} : null}
          resizeMode="cover"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{capitalize(detailEntity.name)}</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{detailEntity.description}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#03071E',
  },
  infoContainer: {
    margin: 20,
  },
  title: {
    color: 'white',
    fontSize: 22,
    lineHeight: 28,
    minHeight: 30,
  },
  description: {
    color: 'white',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.15,
  },
  descriptionContainer: {
    marginTop: 10,
  },
});

export default DetailScreen;
