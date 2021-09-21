// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, PartialTheme, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { BaseCustomStylesProps } from '../types';
import { controlBarStyles } from './styles/ControlBar.styles';
import { useTheme } from '../theming';
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
 * [Button](https://developer.microsoft.com/fluentui#/controls/web/button) component from
 * Fluent UI. Users will need to provide methods to Button components used inside `ControlBar`
 * for altering call behavior.
 */
export const ControlBar = (props: ControlBarProps): JSX.Element => {
  const { styles, layout } = props;
  const theme = useTheme();
  const controlBarClassName = useMemo(() => {
    const controlBarStyle = controlBarStyles[layout ?? 'horizontal'];
    // if theme is dark and layout is floating then use palette.neutralQuaternaryAlt as background, otherwise use palette.white
    const backgroundStyle = {
      background:
        isDarkThemed(theme) && layout?.startsWith('floating') ? theme.palette.neutralQuaternaryAlt : theme.palette.white
    };
    // if rtl is true and layout is either floatingTop or floatingBottom then we need to override the transform-style property
    // to translate 50% to right instead of the left
    const transformOverrideStyle =
      theme.rtl && (layout === 'floatingTop' || layout === 'floatingBottom') ? { transform: 'translateX(50%)' } : {};
    return mergeStyles(controlBarStyle, backgroundStyle, transformOverrideStyle, styles?.root);
  }, [layout, styles?.root, theme]);
  return (
    <div className={mergeStyles(mainDivStyle)}>
      <Stack
        className={mergeStyles(controlBarClassName, {
          borderRadius: (theme as PartialTheme)?.effects?.roundedCorner6,
          boxShadow: (theme as PartialTheme)?.effects?.elevation8
        })}
      >
        {props.children}
      </Stack>
    </div>
  );
};
