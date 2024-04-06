import * as React from 'react';
import {FlatList} from 'react-native';
import {Card, Text} from 'react-native-paper';
import {useRoute} from '@react-navigation/native';

const RecipesScreen = () => {
  const route = useRoute();

  // Access navigation params from route.params
  const {recipes} = route.params;
  return (
    <FlatList
      data={recipes}
      renderItem={({item: recipe}) => (
        <Card>
          <Card.Title title={recipe.name} />
          <Card.Content>
            <Text variant="bodyMedium">{recipe.description}</Text>
          </Card.Content>
        </Card>
      )}
      keyExtractor={recipe => recipe.id.toString()}
    />
  );
};

export default RecipesScreen;
