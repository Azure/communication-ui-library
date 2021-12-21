// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, mergeStyles } from '@fluentui/react';
import React from 'react';
import { useTheme } from '../theming';

/**
 * Strings of HighContrastAwareIcon that can be overridden.
 *
 * @public
 */
export interface HighContrastAwareIconProps {
  /** Icon name */
  iconName: string;
  /** Whether button is disabled */
  disabled?: boolean | undefined;
}

/**
 * This is a helper component to define and unify icon colors
 *
 * @public
 */
export const HighContrastAwareIcon = (props: HighContrastAwareIconProps): JSX.Element => {
  const { iconName, disabled } = props;
  const theme = useTheme();
  // setting colors for the icons using color from theme, so in dark mode or other accessibility modes, they have pre-defined contrast colors
  return (
    <Icon
      iconName={iconName}
      className={mergeStyles({
        svg: { fill: disabled ? theme.palette.neutralTertiary : theme.palette.neutralPrimaryAlt }
      })}
    />
  );
};
