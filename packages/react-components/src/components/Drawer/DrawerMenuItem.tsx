// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Icon, IIconProps, IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
import React from 'react';
import { useTheme } from '../../theming/FluentThemeProvider';
import { BaseCustomStyles } from '../../types';
import { submitWithKeyboard } from '../utils/keyboardNavigation';

/**
 * Props for the DrawerMenuItem
 *
 * @internal
 */
export interface _DrawerMenuItemProps {
  onItemClick?: (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>, itemKey?: string) => void;
  key: string;
  text?: string;
  iconProps?: IIconProps;
  styles?: BaseCustomStyles;

  // Support for submenu coming in follow up PR
  // subMenuProps?: _DrawerMenuItemProps[];
}

/**
 * Maps the individual item in menuProps.items passed in the {@link DrawerMenu} into a UI component.
 *
 * @private
 */
export const DrawerMenuItem = (props: _DrawerMenuItemProps): JSX.Element => {
  const palette = useTheme().palette;
  const onClick = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>): void =>
    props.onItemClick && props.onItemClick(ev, props.key);
  const onKeyPress = (ev: React.KeyboardEvent<HTMLElement>): void => onClick && submitWithKeyboard(ev, onClick);

  return (
    <Stack
      tabIndex={0}
      horizontal
      className={mergeStyles(drawerMenuItemRootStyles(palette.neutralLight), props.styles?.root)}
      onKeyPress={onKeyPress}
      onClick={onClick}
      tokens={menuItemChildrenGap}
    >
      {props.iconProps && (
        <Stack.Item role="presentation">
          <Icon {...props.iconProps} />
        </Stack.Item>
      )}
      <Stack.Item grow>
        <Text>{props.text}</Text>
      </Stack.Item>
      {/*
      // Support for submenu coming in follow up PR
      {props.subMenuProps && (
        <Stack.Item>
          <ChevronRight20Regular primaryFill="currentColor" />
        </Stack.Item>
      )}
      */}
    </Stack>
  );
};

const menuItemChildrenGap = { childrenGap: '0.5rem' };

const drawerMenuItemRootStyles = (hoverBackground: string): IStyle => ({
  height: '3rem',
  lineHeight: '3rem',
  fontSize: '1rem',
  padding: '0rem 0.75rem',
  cursor: 'pointer',
  ':hover, :focus': {
    background: hoverBackground
  }
});
