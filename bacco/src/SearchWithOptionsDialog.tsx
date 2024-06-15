/**
 * Displays a search component with options
 *
 * @format
 */

import React from 'react';
import {ScrollView, StyleSheet, Text} from 'react-native';
import {Button, Dialog} from 'react-native-paper';
import Searchbox from './Searchbox';

const {useCallback, useEffect, useState} = React;

export type SearchWithOptionsDialogProps = {
  clearDialog: () => void;
  isShowingDialog: boolean;
  onChangeSearch: (text: string) => void;
  onConfirm: (selectedOption: string) => void;
  options: string[];
  title: string;
};

function SearchWithOptionsDialog({
  clearDialog,
  isShowingDialog,
  onChangeSearch,
  onConfirm,
  options,
  title,
}: SearchWithOptionsDialogProps): React.JSX.Element {
  const [searchedText, setSearchedText] = useState('');
  const [selectedOption, setSelectedOption] = useState('');

  useEffect(() => {
    if (selectedOption && !options.some(option => option === selectedOption)) {
      setSelectedOption('');
    }
  }, [options, selectedOption]);

  const dismiss = useCallback(() => {
    clearDialog();
    setSearchedText('');
    setSelectedOption('');
  }, [clearDialog]);

  const confirmCallback = useCallback(() => {
    onConfirm(selectedOption);
    dismiss();
  }, [dismiss, onConfirm, selectedOption]);

  const onChangeSearchText = useCallback(
    (text: string) => {
      setSearchedText(text);
      onChangeSearch(text);
    },
    [onChangeSearch],
  );

  return (
    <Dialog
      testID="search-dialog"
      visible={isShowingDialog}
      style={styles.dialog}
      onDismiss={dismiss}>
      <Dialog.Title testID="search-title">{title}</Dialog.Title>
      <Dialog.Content>
        <Searchbox onChangeText={onChangeSearchText} text={searchedText} />
      </Dialog.Content>
      <Dialog.ScrollArea style={styles.options}>
        <ScrollView>
          {options.map((option, index) => (
            <Button
              key={`option-${index}`}
              testID={`option-${option}`}
              contentStyle={styles.option}
              icon={
                'radiobox-' + (selectedOption === option ? 'marked' : 'blank')
              }
              onPress={() => {
                setSearchedText(option);
                setSelectedOption(option);
              }}>
              {option.toLocaleUpperCase()}
            </Button>
          ))}
        </ScrollView>
      </Dialog.ScrollArea>
      {selectedOption && (
        <Dialog.Actions>
          <Button
            testID="search-options-confirm-button"
            onPress={confirmCallback}
            style={styles.confirmButton}>
            <Text style={styles.confirmButtonText}>Confirmar</Text>
          </Button>
        </Dialog.Actions>
      )}
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    position: 'absolute',
    top: 50,
    width: '85%',
    backgroundColor: '#D2C3C3',
  },
  options: {
    maxHeight: 200,
    borderBottomWidth: 0,
    borderTopWidth: 0,
  },
  option: {
    flexDirection: 'row-reverse',
  },
  confirmButton: {
    backgroundColor: '#370617',
  },
  confirmButtonText: {
    color: '#FFF',
  },
});

export default SearchWithOptionsDialog;
