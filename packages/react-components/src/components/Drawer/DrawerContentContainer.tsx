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
  const backgroundColor = useTheme().palette.white;
  const rootStyles = mergeStyles(containerStyles(backgroundColor), props.styles?.root);

  return <Stack className={rootStyles}>{props.children}</Stack>;
};

const containerStyles = (backgroundColor: string): IStyle => ({
  background: backgroundColor,

  borderTopRightRadius: '0.375rem',
  borderTopLeftRadius: '0.375rem',

  ...AnimationStyles.slideUpIn10
});
