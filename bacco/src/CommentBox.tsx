import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';

const CommentBox = ({onSubmit}) => {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    if (comment.trim().length === 0) {
      return;
    }
    onSubmit(comment);
    setComment('');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        multiline
        placeholder="Escribir un comentario..."
        value={comment}
        onChangeText={text => setComment(text)}
      />
      <TouchableOpacity
        style={[
          styles.button,
          // eslint-disable-next-line react-native/no-inline-styles
          {opacity: comment.trim().length < 16 ? 0.5 : 1},
        ]}
        onPress={handleSubmit}
        disabled={comment.trim().length === 0}>
        <Icon name="sc-telegram" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#03071E',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    lineHeight: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
  },
});

export default CommentBox;
