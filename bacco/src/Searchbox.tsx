import * as React from 'react';
import {Searchbar} from 'react-native-paper';

export type SearchboxProps = {
  onChangeText: (newText: string) => void;
  placeholder?: string;
  text?: string;
};

const {useCallback, useEffect, useState} = React;

const Searchbox = ({onChangeText, placeholder, text}: SearchboxProps) => {
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

  return (
    <Searchbar
      placeholder={placeholder || 'Busca y selecciona una bebida'}
      onChangeText={handleOnChangeText}
      value={searchQuery}
    />
  );
};

export default Searchbox;
