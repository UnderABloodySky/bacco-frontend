import React, {useEffect, useState} from 'react';
import {SafeAreaView, FlatList, StyleSheet, View, Text} from 'react-native';
import {useRoute} from '@react-navigation/native';
import CommentBox from './CommentBox';
import Icon from 'react-native-vector-icons/EvilIcons';

const Comments = ({comments: paramComments}) => {
  const route = useRoute();
  const {id: userId, recipe} = route.params;
  const [comments, setComments] = useState(paramComments || recipe.comments || []);

  useEffect(() => {
    if (paramComments) {
      setComments(prevComments => {
        const commentsToAdd = paramComments.filter(
          paramComment =>
            !prevComments.some(comment => comment.id === paramComment.id),
        );
        return [...prevComments, ...commentsToAdd];
      });
    }
  }, [paramComments]);

  // @ts-ignore
  const handleCommentSubmit = async newComment => {
    const comment = {
      id: Math.random(),
      content: newComment,
      userId,
      recipeId: recipe.id,
    };
    // @ts-ignore
    setComments([comment, ...comments]);
    const stringifiedBody = JSON.stringify({
      content: newComment,
      userId,
      recipeId: recipe.id,
    });
    await fetch('http://localhost:8080/comments', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: stringifiedBody,
    });
  };
  // @ts-ignore
  const renderComment = ({item}) => (
    <View
      key={item.id}
      style={[
        styles.commentContainer,
        item.userId !== userId && styles.commentContainerRight,
      ]}>
      {item.userId === userId && (
        <Icon name="user" size={35} color="#111" style={styles.icon} />
      )}
      <Text>{item.content}</Text>
      {item.userId !== userId && (
        <Icon name="user" size={35} color="#111" style={styles.iconRight} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={comments}
        renderItem={renderComment}
        keyExtractor={item => item?.id?.toString()}
        ListHeaderComponent={<CommentBox onSubmit={handleCommentSubmit} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  commentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#F7F3F9',
    borderRadius: 15,
    marginBottom: 10,
  },
  icon: {
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  iconRight: {
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  commentContainerRight: {
    justifyContent: 'flex-end',
  },
});

export default Comments;
