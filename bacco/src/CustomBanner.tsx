/**
 * Component based on react-native-paper Banner component
 */

import * as React from 'react';
import {Animated, ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import type {LayoutChangeEvent} from 'react-native';
import useLatestCallback from 'use-latest-callback';
import {Surface} from 'react-native-paper';

type CustomBannerProps = {
  /**
   * Whether banner is currently visible.
   */
  visible: boolean;
  /**
   * Content that will be displayed inside banner.
   */
  children: React.ReactNode;
  /**
   * Style of banner's inner content.
   */
  contentStyle?: StyleProp<ViewStyle>;
  style?: Animated.WithAnimatedValue<StyleProp<ViewStyle>>;
  ref?: React.RefObject<View>;
  /**
   * @optional
   * Optional callback that will be called after the opening animation finished running normally
   */
  onShowAnimationFinished?: Animated.EndCallback;
  /**
   * @optional
   * Optional callback that will be called after the closing animation finished running normally
   */
  onHideAnimationFinished?: Animated.EndCallback;
};

/**
 * CustomBanner displays a dropdown component from the navbar, pushing other components down when opened.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import CustomBanner from './CustomBanner';
 *
 * const MyComponent = () => {
 *   const [visible, setVisible] = React.useState(true);
 *
 *   return (
 *     <CustomBanner visible={visible}>
 *       There was a problem processing a transaction on your credit card.
 *     </CustomBanner>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const CustomBanner = ({
  visible,
  children,
  contentStyle,
  style,
  onShowAnimationFinished = () => {},
  onHideAnimationFinished = () => {},
}: CustomBannerProps) => {
  const {current: position} = React.useRef<Animated.Value>(
    new Animated.Value(visible ? 1 : 0),
  );
  const [layout, setLayout] = React.useState<{
    height: number;
    measured: boolean;
  }>({
    height: 0,
    measured: false,
  });

  const showCallback = useLatestCallback(onShowAnimationFinished);
  const hideCallback = useLatestCallback(onHideAnimationFinished);

  const opacity = position.interpolate({
    inputRange: [0, 0.1, 1],
    outputRange: [0, 1, 1],
  });

  React.useEffect(() => {
    if (visible) {
      // show
      Animated.timing(position, {
        duration: 250,
        toValue: 1,
        useNativeDriver: false,
      }).start(showCallback);
    } else {
      // hide
      Animated.timing(position, {
        duration: 200,
        toValue: 0,
        useNativeDriver: false,
      }).start(hideCallback);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, position]);

  const handleLayout = ({nativeEvent}: LayoutChangeEvent) => {
    const {height} = nativeEvent.layout;
    setLayout({height, measured: true});
  };

  // The banner animation has 2 parts:
  // 1. Blank spacer element which animates its height to move the content
  // 2. Actual banner which animates its translateY
  // In initial render, we position everything normally and measure the height of the banner
  // Once we have the height, we apply the height to the spacer and switch the banner to position: absolute
  // We need this because we need to move the content below as if banner's height was being animated
  // However we can't animate banner's height directly as it'll also resize the content inside
  const height = Animated.multiply(position, layout.height);

  const translateY = Animated.multiply(
    Animated.add(position, -1),
    layout.height,
  );
  return (
    <Surface style={[{opacity}, style]}>
      <ScrollView style={[styles.wrapper, contentStyle]}>
        <Animated.View style={[{height}]} />
        <Animated.View
          onLayout={handleLayout}
          style={[
            layout.measured || !visible
              ? // If we have measured banner's height or it's invisible,
                // Position it absolutely, the layout will be taken care of the spacer
                [styles.absolute, {transform: [{translateY}]}]
              : // Otherwise position it normally
                null,
            !layout.measured && !visible
              ? // If we haven't measured banner's height yet and it's invisible,
                // hide it with opacity: 0 so user doesn't see it
                styles.transparent
              : null,
          ]}>
          {children}
        </Animated.View>
      </ScrollView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
    alignSelf: 'center',
    width: '100%',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  transparent: {
    opacity: 0,
  },
});

export default CustomBanner;
