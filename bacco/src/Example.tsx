import React, { useState } from 'react';
import { SafeAreaView, FlatList, StyleSheet, View, Text } from 'react-native';
import CommentBox from './CommentBox';
import Icon from 'react-native-vector-icons/EvilIcons';

const App = () => {
  const [comments, setComments] = useState([]);

  // @ts-ignore
  const handleCommentSubmit = newComment => {
    const comment = {
      id: comments.length + 1,
      text: newComment,
    };
    // @ts-ignore
    setComments([comment, ...comments]);
  };
  // @ts-ignore
  const renderComment = ({item}) => (
    <View style={styles.commentContainer}>
      <Icon name="user" size={24} color="#900" style={styles.icon} />
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={<CommentBox onSubmit={handleCommentSubmit} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  icon: {
    marginRight: 10,
  },
});

export default App;
