/**
 * Displays a search component with options
 *
 * @format
 */

import React from 'react';
import {ScrollView, StyleSheet} from 'react-native';
import {Button, Dialog, IconButton} from 'react-native-paper';
import Searchbox from './Searchbox';

const {useCallback, useEffect, useState} = React;

export type SearchWithOptionsDialogProps = {
  clearDialog: () => void;
  isShowingDialog: boolean;
  onChangeSearch: (text: string) => void;
  onConfirm: (selectedOption: string) => void;
  options: string[];
  placeholder?: string;
  title?: string;
};

function SearchWithOptionsDialog({
  clearDialog,
  isShowingDialog,
  onChangeSearch,
  onConfirm,
  options,
  placeholder,
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
      {!!title && <Dialog.Title testID="search-title">{title}</Dialog.Title>}
      <Dialog.Content>
        <Searchbox
          placeholder={placeholder}
          onChangeText={onChangeSearchText}
          text={searchedText}
        />
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
          <IconButton
            testID="search-options-confirm-button"
            icon="check-circle-outline"
            iconColor="black"
            size={20}
            onPress={confirmCallback}
            mode="contained"
            style={{
              marginVertical: 0,
            }}
          />
        </Dialog.Actions>
      )}
    </Dialog>
  );
}

const styles = StyleSheet.create({
  dialog: {
    position: 'absolute',
    top: 150,
    width: '85%',
    backgroundColor: '#D2C3C3',
  },
  options: {
    maxHeight: 200,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    marginBottom: 5,
  },
  option: {
    flexDirection: 'row-reverse',
  },
  confirmButton: {
    backgroundColor: '#370617',
  },
  confirmButtonText: {
    color: '#370617',
  },
});

export default SearchWithOptionsDialog;
