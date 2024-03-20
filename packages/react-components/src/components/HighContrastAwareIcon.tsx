// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, mergeStyles } from '@fluentui/react';
import React from 'react';
import { useTheme } from '../theming';

/**
 * @internal
 */
export interface _HighContrastAwareIconProps {
  /** Icon name */
  iconName: string;
  /** Whether button is disabled */
  disabled?: boolean | undefined;
}

/**
 * This is a helper component to define and unify icon colors
 *
 * @internal
 */
export const _HighContrastAwareIcon = (props: _HighContrastAwareIconProps): JSX.Element => {
  const { iconName, disabled } = props;
  const theme = useTheme();
  // setting colors for the icons using color from theme, so in dark mode or other accessibility modes, they have pre-defined contrast colors
  // the media query is for when in specific window accessibility mode, change the svg colors
  return (
    <Icon
      iconName={iconName}
      className={mergeStyles({
        svg: {
          fill: disabled ? theme.palette.neutralTertiary : theme.palette.neutralPrimaryAlt,

          '@media (forced-colors: active) and (prefers-color-scheme: dark)': {
            fill: disabled ? theme.palette.neutralPrimaryAlt : theme.palette.neutralTertiary
          }
        }
      })}
    />
  );
};
