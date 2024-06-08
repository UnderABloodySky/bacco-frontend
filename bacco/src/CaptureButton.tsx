/**
 * Displays a camera capture button
 *
 * @format
 */

import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

const CAPTURE_BUTTON_SIZE = 78;

function CaptureButton({
  enabled,
  onPress,
}: {
  enabled: boolean;
  onPress: () => void;
}): React.JSX.Element {
  const [isBeingPressed, setIsBeingPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPressIn={() => {
        setIsBeingPressed(true);
      }}
      onPressOut={() => {
        setIsBeingPressed(false);
      }}
      onPress={onPress}
      disabled={!enabled}
      style={[styles.container, enabled ? styles.enabled : styles.disabled]}>
      <View style={[styles.innerCircle, isBeingPressed && styles.visible]} />
      <View style={styles.outterCircle} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 25,
    zIndex: 999,
  },
  innerCircle: {
    position: 'absolute',
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    backgroundColor: '#9D0208',
    display: 'none',
  },
  outterCircle: {
    width: CAPTURE_BUTTON_SIZE,
    height: CAPTURE_BUTTON_SIZE,
    borderRadius: CAPTURE_BUTTON_SIZE / 2,
    borderWidth: CAPTURE_BUTTON_SIZE * 0.1,
    borderColor: 'white',
  },
  enabled: {
    opacity: 1,
  },
  disabled: {
    opacity: 0.3,
  },
  visible: {
    display: 'flex',
  },
});

export default CaptureButton;
