// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  FontIcon,
  IFontIconProps,
  IIconProps,
  IRawStyle,
  IStackStyles,
  IStyle,
  mergeStyles,
  Stack,
  Text
} from '@fluentui/react';
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
  /** A component that shows at the end of the menu item before any secondaryIcon is supplied */
  secondaryComponent?: JSX.Element;
  /** Icon shown at the start of the menu item (before the menu item text) */
  iconProps?: IIconProps;
  /**
   * Icon shown at the end of the menu item.
   * By default if this component has subMenuProps, this icon is the RightChevron.
   */
  secondaryIconProps?: IIconProps;
  styles?: BaseCustomStyles;
  subMenuProps?: _DrawerMenuItemProps[];
  /**
   * Whether the menu item is disabled
   * @defaultvalue false
   */
  disabled?: boolean;
  /**
   * A unique id set for the standard HTML id attibute
   */
  id?: string;
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
    <MenuItemIcon {...props.secondaryIconProps} />
  ) : props.subMenuProps ? (
    <MenuItemIcon iconName="ChevronRight" />
  ) : undefined;

  return (
    <Stack
      tabIndex={0}
      role="menuitem"
      horizontal
      className={mergeStyles(
        drawerMenuItemRootStyles(theme.palette.neutralLight, theme.fonts.small),
        props.disabled ? disabledDrawerMenuItemRootStyles(theme.palette.neutralQuaternaryAlt) : undefined,
        props.styles?.root
      )}
      onKeyPress={props.disabled ? undefined : onKeyPress}
      onClick={props.disabled ? undefined : onClick}
      tokens={menuItemChildrenGap}
      id={props.id}
    >
      {props.iconProps && (
        <Stack.Item
          role="presentation"
          styles={props.disabled ? { root: { color: theme.palette.neutralTertiaryAlt } } : undefined}
        >
          <MenuItemIcon {...props.iconProps} />
        </Stack.Item>
      )}
      <Stack.Item styles={drawerMenuItemTextStyles} grow>
        <Text styles={props.disabled ? { root: { color: theme.palette.neutralTertiaryAlt } } : undefined}>
          {props.text}
        </Text>
      </Stack.Item>
      {props.secondaryText && (
        <Stack.Item styles={drawerMenuItemTextStyles} className={mergeStyles(secondaryTextStyles)}>
          <Text
            styles={{
              root: { color: props.disabled ? theme.palette.neutralTertiaryAlt : theme.palette.neutralSecondary }
            }}
          >
            {props.secondaryText}
          </Text>
        </Stack.Item>
      )}
      {props.secondaryComponent && <Stack.Item>{props.secondaryComponent}</Stack.Item>}
      {secondaryIcon && <Stack.Item>{secondaryIcon}</Stack.Item>}
    </Stack>
  );
};

const MenuItemIcon = (props: IFontIconProps): JSX.Element => (
  <FontIcon className={mergeStyles(iconStyles)} {...props} />
);

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

const disabledDrawerMenuItemRootStyles = (background: string): IStyle => ({
  pointerEvents: 'none',
  background: background,
  ':hover, :focus': {
    background: background
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

const iconStyles: IStyle = {
  // Vertically center icons in the menu item. Using line-height does not work for centering fluent SVG icons.
  display: 'flex',
  alignItems: 'center',
  height: '100%',

  // This can be removed when we upgrade to fluent-react-icons v2 (that removes the inner span element)
  ' span': {
    display: 'flex',
    alignItems: 'center',
    height: '100%'
  }
};

const secondaryTextStyles: IStyle = {
  // limit width for secondaryText in the menu item so it does not overlap with text on left.
  maxWidth: '50%'
};
