// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FontIcon, Icon, IIconProps, IRawStyle, IStackStyles, IStyle, mergeStyles, Stack, Text } from '@fluentui/react';
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
  /** Text that shows at the start of the menu item after any icon supplied */
  text?: string;
  /** Text that shows at the end of the menu item before any secondaryIcon is supplied */
  secondaryText?: string;
  /** Icon shown at the start of the menu item (before the menu item text) */
  iconProps?: IIconProps;
  /**
   * Icon shown at the end of the menu item.
   * By default if this component has subMenuProps, this icon is the RightChevron.
   */
  secondaryIconProps?: IIconProps;
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

  const secondaryIcon = props.secondaryIconProps ? (
    <FontIcon {...props.secondaryIconProps} />
  ) : props.subMenuProps ? (
    <FontIcon iconName="ChevronRight" />
  ) : undefined;

  return (
    <Stack
      tabIndex={0}
      role="menuitem"
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
      <Stack.Item styles={drawerMenuItemTextStyles} grow>
        <Text>{props.text}</Text>
      </Stack.Item>
      {props.secondaryText && (
        <Stack.Item styles={drawerMenuItemTextStyles}>
          <Text className={mergeStyles({ color: theme.palette.neutralSecondary })}>{props.secondaryText}</Text>
        </Stack.Item>
      )}
      {secondaryIcon && <Stack.Item>{secondaryIcon}</Stack.Item>}
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

/** Ensure long text entries appropriately show ellipsis instead of wrapping to a new line or showing a scrollbar */
const drawerMenuItemTextStyles: IStackStyles = {
  root: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  }
};
