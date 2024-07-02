import * as React from 'react';
import {ViewStyle} from 'react-native';
import {Searchbar} from 'react-native-paper';

export type SearchboxProps = {
  onChangeText: (newText: string) => void;
  placeholder?: string;
  text?: string;
  style?: ViewStyle;
};

const {useCallback, useEffect, useState} = React;

const Searchbox = ({
  onChangeText,
  placeholder,
  text,
  style = {},
}: SearchboxProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (text !== undefined) {
      setSearchQuery(text);
    }
  }, [text]);

  const handleOnChangeText = useCallback(
    (newSearchTerm: string) => {
      if (onChangeText) {
        onChangeText(newSearchTerm);
      }
      setSearchQuery(newSearchTerm);
    },
    [onChangeText],
  );

  const searchInputCustomStyle = {
    minHeight: 40,
  };

  return (
    <Searchbar
      placeholder={placeholder || 'Busca una bebida'}
      onChangeText={handleOnChangeText}
      value={searchQuery}
      inputStyle={searchInputCustomStyle}
      style={style}
    />
  );
};

export default Searchbox;
