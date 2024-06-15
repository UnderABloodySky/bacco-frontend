/**
 * @format
 */

import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {PaperProvider, Portal} from 'react-native-paper';
import SearchWithOptionsDialog from '../src/SearchWithOptionsDialog';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => {
  const {View: RNView, Text: RNText} = require('react-native');
  return {
    __esModule: true, // This property makes it compatible with ES module imports
    default: ({name, ...props}: {name: string}) => (
      // Simple view with text to represent the icon
      <RNView {...props}>
        <RNText>{name}</RNText>
      </RNView>
    ),
  };
});

jest.mock('react-native-safe-area-context', () =>
  jest.requireActual('react-native-safe-area-context'),
);

jest.mock('react-native-paper', () => jest.requireActual('react-native-paper'));

describe('SearchWithOptionsDialog', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  it('should not render dialog when passing false to isShowingDialog', () => {
    // Arrange
    const {queryByTestId} = render(
      <PaperProvider>
        <Portal>
          <SearchWithOptionsDialog
            isShowingDialog={false}
            title="Test Title"
            options={['Option1', 'Option2']}
            clearDialog={() => {}}
            onChangeSearch={() => {}}
            onConfirm={() => {}}
          />
        </Portal>
      </PaperProvider>,
    );

    // Assert
    expect(queryByTestId('search-dialog')).toBeNull();
    expect(queryByTestId('search-title')).toBeNull();
  });

  it('should render correctly with a matching title', () => {
    // Arrange
    const {getByTestId} = render(
      <PaperProvider>
        <Portal>
          <SearchWithOptionsDialog
            isShowingDialog={true}
            title="Test Title"
            options={['Option1', 'Option2']}
            clearDialog={() => {}}
            onChangeSearch={() => {}}
            onConfirm={() => {}}
          />
        </Portal>
      </PaperProvider>,
    );

    // Assert
    expect(getByTestId('search-dialog')).toBeTruthy();
    expect(getByTestId('search-title').props.children).toBe('Test Title');
  });

  it('should show all options icons unselected', () => {
    // Arrange
    const {getByTestId} = render(
      <PaperProvider>
        <Portal>
          <SearchWithOptionsDialog
            isShowingDialog={true}
            title="Test Title"
            options={['Option1', 'Option2']}
            clearDialog={() => {}}
            onChangeSearch={() => {}}
            onConfirm={() => {}}
          />
        </Portal>
      </PaperProvider>,
    );

    // Assert
    // radiobox-blank is the default icon for unselected options
    const option1IconContainer = getByTestId('option-Option1-icon-container');
    const option2IconContainer = getByTestId('option-Option2-icon-container');
    expect(
      option1IconContainer.findByProps({source: 'radiobox-blank'}),
    ).toBeTruthy();
    expect(
      option2IconContainer.findByProps({source: 'radiobox-blank'}),
    ).toBeTruthy();
  });

  it('should update selected option icon on button press', () => {
    // Arrange
    const {getByTestId} = render(
      <PaperProvider>
        <Portal>
          <SearchWithOptionsDialog
            isShowingDialog={true}
            title="Test Title"
            options={['Option1', 'Option2']}
            clearDialog={() => {}}
            onChangeSearch={() => {}}
            onConfirm={() => {}}
          />
        </Portal>
      </PaperProvider>,
    );

    // Act
    const optionButton = getByTestId('option-Option1');
    fireEvent.press(optionButton);

    // Assert
    // expect that the selected option has it's icon updated (selected) after being pressed
    const iconContainer = getByTestId('option-Option1-icon-container');
    expect(iconContainer.findByProps({source: 'radiobox-marked'})).toBeTruthy();
  });

  it('should not show confirm button when no option is selected', () => {
    // Arrange
    const {queryByTestId} = render(
      <PaperProvider>
        <Portal>
          <SearchWithOptionsDialog
            isShowingDialog={true}
            title="Test Title"
            options={['Option1', 'Option2']}
            clearDialog={() => {}}
            onChangeSearch={() => {}}
            onConfirm={() => {}}
          />
        </Portal>
      </PaperProvider>,
    );

    // Assert
    expect(queryByTestId('search-options-confirm-button')).toBeNull();
  });

  it('should call confirmCallback when confirm button is pressed', () => {
    // Arrange
    const confirmCallback = jest.fn();
    const {getByTestId} = render(
      <PaperProvider>
        <Portal>
          <SearchWithOptionsDialog
            isShowingDialog={true}
            title="Test Title"
            options={['Option1', 'Option2']}
            clearDialog={() => {}}
            onChangeSearch={() => {}}
            onConfirm={confirmCallback}
          />
        </Portal>
      </PaperProvider>,
    );

    const optionButton = getByTestId('option-Option1');
    fireEvent.press(optionButton);

    // Negative assert
    expect(confirmCallback).not.toHaveBeenCalled();

    // Act
    const confirmButton = getByTestId('search-options-confirm-button');
    fireEvent.press(confirmButton);

    // Assert
    expect(confirmCallback).toHaveBeenCalled();
  });
});
