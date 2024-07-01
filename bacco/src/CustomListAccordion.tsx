import * as React from 'react';
import {
  GestureResponderEvent,
  I18nManager,
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewProps,
  ViewStyle,
  PressableAndroidRippleConfig,
} from 'react-native';

import {TouchableRipple} from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';
import Text from 'react-native-paper/src/components/Typography/Text';

export type Props = {
  /**
   * Title text for the list accordion.
   */
  title: React.ReactNode;
  /**
   * Description text for the list accordion.
   */
  description?: React.ReactNode;
  /**
   * Callback which returns a React element to display on the right side.
   */
  right?: (props: { isExpanded: boolean }) => React.ReactNode;
  /**
   * Whether the accordion is expanded
   * If this prop is provided, the accordion will behave as a "controlled component".
   * You'll need to update this prop when you want to toggle the component or on `onPress`.
   */
  expanded?: boolean;
  /**
   * Function to execute on press.
   */
  onPress?: (e: GestureResponderEvent) => void;
  /**
   * Function to execute on long press.
   */
  onLongPress?: (e: GestureResponderEvent) => void;
  /**
   * The number of milliseconds a user must touch the element before executing `onLongPress`.
   */
  delayLongPress?: number;
  /**
   * Content of the section.
   */
  children: React.ReactNode;
  /**
   * Type of background drawabale to display the feedback (Android).
   * https://reactnative.dev/docs/pressable#rippleconfig
   */
  background?: PressableAndroidRippleConfig;
  /**
   * Style that is passed to the wrapping TouchableRipple element.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * Style that is passed to Title element.
   */
  titleStyle?: StyleProp<TextStyle>;
  /**
   * Style that is passed to Description element.
   */
  descriptionStyle?: StyleProp<TextStyle>;
  /**
   * Truncate Title text such that the total number of lines does not
   * exceed this number.
   */
  titleNumberOfLines?: number;
  /**
   * Truncate Description text such that the total number of lines does not
   * exceed this number.
   */
  descriptionNumberOfLines?: number;
  /**
   * Specifies the largest possible scale a title font can reach.
   */
  titleMaxFontSizeMultiplier?: number;
  /**
   * Specifies the largest possible scale a description font can reach.
   */
  descriptionMaxFontSizeMultiplier?: number;
  /**
   * TestID used for testing purposes
   */
  testID?: string;
  /**
   * Accessibility label for the TouchableRipple. This is read by the screen reader when the user taps the touchable.
   */
  accessibilityLabel?: string;
  /**
   * `pointerEvents` passed to the `View` container
   */
  pointerEvents?: ViewProps['pointerEvents'];
};

/**
 * A component used to display an expandable list item.
 *
 * ## Usage
 * ```js
 * import * as React from 'react';
 * import { List } from 'react-native-paper';
 *
 * const MyComponent = () => {
 *   const [expanded, setExpanded] = React.useState(true);
 *
 *   const handlePress = () => setExpanded(!expanded);
 *
 *   return (
 *     <List.Section title="Accordions">
 *       <List.Accordion
 *         title="Uncontrolled Accordion">
 *         <List.Item title="First item" />
 *         <List.Item title="Second item" />
 *       </List.Accordion>
 *
 *       <List.Accordion
 *         title="Controlled Accordion"
 *         expanded={expanded}
 *         onPress={handlePress}>
 *         <List.Item title="First item" />
 *         <List.Item title="Second item" />
 *       </List.Accordion>
 *     </List.Section>
 *   );
 * };
 *
 * export default MyComponent;
 * ```
 */
const CustomListAccordion = ({
  right,
  title,
  description,
  children,
  titleStyle,
  descriptionStyle,
  titleNumberOfLines = 1,
  descriptionNumberOfLines = 2,
  style,
  testID,
  background,
  onPress,
  onLongPress,
  delayLongPress,
  expanded: expandedProp,
  accessibilityLabel,
  pointerEvents = 'none',
  titleMaxFontSizeMultiplier,
  descriptionMaxFontSizeMultiplier,
}: Props) => {
  const [expanded, setExpanded] = React.useState<boolean>(
    expandedProp || false
  );

  const handlePressAction = (e: GestureResponderEvent) => {
    onPress?.(e);

    if (expandedProp === undefined) {
      // Only update state of the `expanded` prop was not passed
      // If it was passed, the component will act as a controlled component
      setExpanded(expanded => !expanded);
    }
  };

  const expandedInternal = expandedProp !== undefined ? expandedProp : expanded;

  const isExpanded = expandedInternal;

  const handlePress = handlePressAction;

  return (
    <View>
      <View>
        <TouchableRipple
          style={[styles.containerV3, style]}
          onPress={handlePress}
          onLongPress={onLongPress}
          delayLongPress={delayLongPress}
          accessibilityRole="button"
          accessibilityState={{expanded: isExpanded}}
          accessibilityLabel={accessibilityLabel}
          testID={testID}
          background={background}
          borderless>
          <View style={styles.rowV3} pointerEvents={pointerEvents}>
            <View style={[styles.itemV3, styles.content]}>
              <Text
                selectable={false}
                numberOfLines={titleNumberOfLines}
                style={[styles.title, titleStyle]}
                maxFontSizeMultiplier={titleMaxFontSizeMultiplier}>
                {title}
              </Text>
              {description ? (
                <Text
                  selectable={false}
                  numberOfLines={descriptionNumberOfLines}
                  style={[styles.description, descriptionStyle]}
                  maxFontSizeMultiplier={descriptionMaxFontSizeMultiplier}>
                  {description}
                </Text>
              ) : null}
            </View>
            <View
              style={[styles.item, description ? styles.multiline : undefined]}>
              {right ? (
                right({
                  isExpanded: isExpanded,
                })
              ) : (
                <MaterialCommunityIcon
                  name={isExpanded ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  direction={I18nManager.getConstants().isRTL ? 'rtl' : 'ltr'}
                />
              )}
            </View>
          </View>
        </TouchableRipple>
      </View>

      {isExpanded
        ? React.Children.map(children, child => {
            return child;
          })
        : null}
    </View>
  );
};

CustomListAccordion.displayName = 'List.Accordion';

const styles = StyleSheet.create({
  container: {
    padding: 8,
  },
  containerV3: {
    paddingVertical: 8,
    paddingRight: 15,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowV3: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  multiline: {
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
  },
  item: {
    marginVertical: 6,
    paddingLeft: 8,
  },
  itemV3: {
    paddingLeft: 16,
  },
  child: {
    paddingLeft: 64,
  },
  childV3: {
    paddingLeft: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default CustomListAccordion;
