// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Stack, useTheme } from '@fluentui/react';
import React from 'react';
import { BaseCustomStylesProps } from '../types';
import { controlBarStyles } from './styles/ControlBar.styles';
import { isDarkThemed } from '../theming/themeUtils';

const mainDivStyle: IStyle = { position: 'relative', height: '100%', width: '100%' };

export type ControlBarLayoutType =
  | 'horizontal'
  | 'vertical'
  | 'dockedTop'
  | 'dockedBottom'
  | 'dockedLeft'
  | 'dockedRight'
  | 'floatingTop'
  | 'floatingBottom'
  | 'floatingLeft'
  | 'floatingRight';

/**
 * Props for ControlBar component.
 */
export interface ControlBarProps {
  /** React Child components. */
  children?: React.ReactNode;
  /**
   * Allows users to pass an object containing custom CSS styles.
   * @Example
   * ```
   * <ControlBar styles={{ root: { background: 'blue' } }} />
   * ```
   */
  styles?: BaseCustomStylesProps;
  /**
   * Changes the layout of the control bar.
   * Available layouts are `horizontal`, `vertical`, `dockedTop`, `dockedBottom`,
   * `dockedLeft`, `dockedRight`, `floatingTop`, `floatingBottom`, `floatingLeft`,
   * `floatingRight`
   * Defaults to a `horizontal` layout.
   */
  layout?: ControlBarLayoutType;
}

/**
 * `ControlBar` allows you to easily create a component for call controls using
 * [Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) component from
 * Fluent UI. Users will need to provide methods to Button components used inside `ControlBar`
 * for altering call behavior.
 */
export const ControlBar = (props: ControlBarProps): JSX.Element => {
  const { styles, layout } = props;
  const theme = useTheme();
  const controlBarStyle = controlBarStyles[layout ?? 'horizontal'];
  return (
    <div className={mergeStyles(mainDivStyle)}>
      <Stack
        className={mergeStyles(
          controlBarStyle,
          {
            background:
              isDarkThemed(theme) && layout?.startsWith('floating')
                ? theme.palette.neutralQuaternaryAlt
                : theme.palette.white
          },
          styles?.root
        )}
      >
        {props.children}
      </Stack>
    </div>
  );
};
