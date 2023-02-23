// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AnimationStyles, IStyle, mergeStyles, Stack, Text, Theme, useTheme } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../../types';

/**
 * Container that holds the content of the drawer
 *
 * @private
 */
export const DrawerContentContainer = (props: {
  children: React.ReactNode;
  heading?: string;
  styles?: BaseCustomStyles;
}): JSX.Element => {
  const theme = useTheme();
  const backgroundColor = theme.palette.white;
  const borderRadius = theme.effects.roundedCorner4;
  const rootStyles = mergeStyles(containerStyles(backgroundColor, borderRadius), props.styles?.root);

  return (
    <Stack className={rootStyles}>
      {props.heading && (
        <Stack className={mergeStyles(headingContainerStyles)}>
          <Text className={mergeStyles(headingStyles(theme))}>{props.heading}</Text>
        </Stack>
      )}
      {props.children}
    </Stack>
  );
};

const containerStyles = (backgroundColor: string, borderRadius: string): IStyle => ({
  background: backgroundColor,

  borderTopRightRadius: borderRadius,
  borderTopLeftRadius: borderRadius,

  ...AnimationStyles.slideUpIn10
});

const headingContainerStyles: IStyle = {
  textAlign: 'center',
  width: '100%',
  padding: '0.5rem'
};

const headingStyles = (theme: Theme): IStyle => ({
  color: theme.palette.neutralSecondary,
  fontSize: theme.fonts.smallPlus.fontSize,
  lineHeight: '1rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});
