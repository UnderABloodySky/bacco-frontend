import * as React from 'react';
import {StyleSheet} from 'react-native';
import {Banner as PaperBanner} from 'react-native-paper';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';

export type BannerProps = {
  visible: boolean;
  text: string;
  iconName: string;
  onConfirm: () => void;
  onCancel: () => void;
  onFix: () => void;
};

const Banner = ({
  visible,
  text,
  iconName,
  onCancel,
  onConfirm,
  onFix,
}: BannerProps) => {
  return (
    <PaperBanner
      visible={visible}
      actions={[
        {
          label: 'Ok',
          onPress: onConfirm,
        },
        {
          label: 'Cancelar',
          onPress: onCancel,
        },
        {
          label: 'Corregir',
          onPress: onFix,
        },
      ]}
      contentStyle={styles.bannerContent}
      // eslint-disable-next-line react/no-unstable-nested-components
      icon={({size}) => <IconMC name={iconName} size={size} color="black" />}>
      {text}
    </PaperBanner>
  );
};

const styles = StyleSheet.create({
  bannerContent: {
    backgroundColor: '#f7f3f9',
  },
});

export default Banner;
