import React from 'react';
import { Text } from 'react-native';

export const fonts = {
  regular: 'PuviRegular',
  medium: 'PuviMedium',
  semibold: 'PuviSemiBold',
  bold: 'PuviBold',
};


const BaseText = ({ style, children, ...props }) => {
  return (
    <Text style={style} {...props}>
      {children}
    </Text>
  );
};


export const AppRegularText = ({ style, children, ...props }) => (
  <BaseText style={[{ fontFamily: fonts.regular }, style]} {...props}>
    {children}
  </BaseText>
);

export const AppMediumText = ({ style, children, ...props }) => (
  <BaseText style={[{ fontFamily: fonts.medium }, style]} {...props}>
    {children}
  </BaseText>
);

export const AppSemiBoldText = ({ style, children, ...props }) => (
  <BaseText style={[{ fontFamily: fonts.semibold }, style]} {...props}>
    {children}
  </BaseText>
);

export const AppBoldText = ({ style, children, ...props }) => (
  <BaseText style={[{ fontFamily: fonts.bold }, style]} {...props}>
    {children}
  </BaseText>
);
