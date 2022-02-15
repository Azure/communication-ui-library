// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FontIcon, Icon, IIconProps, IRawStyle, IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
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
  itemKey: string;
  text?: string;
  iconProps?: IIconProps;
  styles?: BaseCustomStyles;
  subMenuProps?: _DrawerMenuItemProps[];
}

/**
 * Maps the individual item in menuProps.items passed in the {@link DrawerMenu} into a UI component.
 *
 * @private
 */
export const DrawerMenuItem = (props: _DrawerMenuItemProps): JSX.Element => {
  const theme = useTheme();
  const onClick = (ev?: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>): void =>
    props.onItemClick && props.onItemClick(ev, props.itemKey);
  const onKeyPress = (ev: React.KeyboardEvent<HTMLElement>): void => onClick && submitWithKeyboard(ev, onClick);

  return (
    <Stack
      tabIndex={0}
      role="button"
      horizontal
      className={mergeStyles(
        drawerMenuItemRootStyles(theme.palette.neutralLight, theme.fonts.small),
        props.styles?.root
      )}
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
      {props.subMenuProps && (
        <Stack.Item>
          <FontIcon iconName="ChevronRight" />
        </Stack.Item>
      )}
    </Stack>
  );
};

const menuItemChildrenGap = { childrenGap: '0.5rem' };

const drawerMenuItemRootStyles = (hoverBackground: string, fontSize: IRawStyle): IStyle => ({
  ...fontSize,
  height: '3rem',
  lineHeight: '3rem',
  padding: '0rem 0.75rem',
  cursor: 'pointer',
  ':hover, :focus': {
    background: hoverBackground
  }
});
