// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AnimationStyles, IStyle, mergeStyles, Stack, useTheme } from '@fluentui/react';
import React, { useMemo } from 'react';
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
  const defaultStyles = useMemo(() => containerStyles(backgroundColor), [backgroundColor]);
  const rootStyles = mergeStyles(defaultStyles, props.styles?.root);

  return <Stack className={rootStyles}>{props.children}</Stack>;
};

const containerStyles = (backgroundColor: string): IStyle => ({
  background: backgroundColor,

  borderTopRightRadius: '1rem',
  borderTopLeftRadius: '1rem',
  'div:first-child': {
    borderTopRightRadius: '1rem',
    borderTopLeftRadius: '1rem'
  },

  ...AnimationStyles.slideUpIn10
});
