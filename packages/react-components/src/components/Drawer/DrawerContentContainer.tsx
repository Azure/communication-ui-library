// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AnimationStyles, IStyle, mergeStyles, Stack, useTheme } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../../types';

/**
 * Container that holds the content of the drawer
 *
 * @private
 */
export const DrawerContentContainer = (props: {
  children: React.ReactNode;
  styles?: BaseCustomStyles;
}): JSX.Element => {
  const theme = useTheme();
  const backgroundColor = theme.palette.white;
  const borderRadius = theme.effects.roundedCorner4;
  const rootStyles = mergeStyles(containerStyles(backgroundColor, borderRadius), props.styles?.root);

  return <Stack className={rootStyles}>{props.children}</Stack>;
};

const containerStyles = (backgroundColor: string, borderRadius: string): IStyle => ({
  background: backgroundColor,

  borderTopRightRadius: borderRadius,
  borderTopLeftRadius: borderRadius,

  ...AnimationStyles.slideUpIn10
});
