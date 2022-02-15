// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { merge, Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { _DrawerSurfaceProps } from '.';
import { useTheme } from '../../theming/FluentThemeProvider';
import { BaseCustomStyles } from '../../types';
import { DrawerMenuItem, _DrawerMenuItemProps } from './DrawerMenuItem';
import { _DrawerSurface, _DrawerSurfaceStyles } from './DrawerSurface';

/**
 * Styles for the {@link _DrawerMenu}.
 *
 * @internal
 */
export interface _DrawerMenuStyles extends BaseCustomStyles {
  /** Styles for the {@link DrawerSurface} container. */
  drawerSurfaceStyles?: _DrawerSurfaceStyles;
}

/**
 * Props for the {@link _DrawerMenu}
 *
 * @internal
 */
export interface _DrawerMenuProps {
  items: _DrawerMenuItemProps[];

  /**
   * Callback when the drawer's light-dismissal is triggered.
   */
  onLightDismiss: () => void;

  styles?: _DrawerMenuStyles;
}

/**
 * Takes a set of menu items and returns a created menu inside a {@link _DrawerSurface}.
 *
 * @internal
 */
export const _DrawerMenu = (props: _DrawerMenuProps): JSX.Element => {
  // This component breaks from a pure component pattern in order to internally support sub menus.
  // When a sub menu item is clicked the menu items to display is updated to be that of the submenu.
  const [menuItems, setMenuItems] = useState<_DrawerMenuItemProps[]>(props.items);

  // Here we store the itemCallbacks in state, so when the submenu handler is attached tp the menu
  // item, a re-render will be triggered with the updated onItemClick callback.
  const [onItemClicks, setOnItemClicks] = useState(props.items.map((item) => item.onItemClick));

  // When menu items update the user focus goes into the ether. To workaround this we force the
  // FocusTrapZone to re-render. This effectively resets the focus trap zone allowing the newly
  // rendered menu items to correctly inherit focus (i.e. the topmost menu item gets focus).
  const [forceUpdateValue, forceUpdate] = React.useReducer((bool) => !bool, false);

  // Bind submenu handler to all items that have subMenuProps
  useEffect(() => {
    setOnItemClicks(
      menuItems.map((item) =>
        bindSubmenuHandlerToItemIfApplicable(item, (newItems: _DrawerMenuItemProps[]) => {
          setMenuItems(newItems);
          forceUpdate();
        })
      )
    );
  }, [menuItems]);

  // Ensure the first item has a border radius that matches the DrawerSurface
  const borderRadius = useTheme().effects.roundedCorner4;
  const firstItemStyle = menuItems[0]?.styles;
  const modifiedFirstItemStyle = useMemo(
    () =>
      merge(firstItemStyle ?? {}, {
        root: {
          borderTopRightRadius: borderRadius,
          borderTopLeftRadius: borderRadius
        }
      }),
    [firstItemStyle, borderRadius]
  );

  return (
    <_DrawerSurface
      key={+forceUpdateValue}
      styles={props.styles?.drawerSurfaceStyles}
      onLightDismiss={props.onLightDismiss}
    >
      <Stack styles={props.styles} role="menu">
        {menuItems.slice(0, 1).map((item) => (
          <DrawerMenuItem {...item} key={0} styles={modifiedFirstItemStyle} onItemClick={onItemClicks[0]} />
        ))}
        {menuItems.slice(1).map((item, i) => (
          <DrawerMenuItem {...item} key={i + 1} onItemClick={onItemClicks[i + 1]} />
        ))}
      </Stack>
    </_DrawerSurface>
  );
};

const bindSubmenuHandlerToItemIfApplicable = (
  item: _DrawerMenuItemProps,
  subMenuCallback: (newItems: _DrawerMenuItemProps[]) => void
):
  | ((
      ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
      itemKey?: string | undefined
    ) => void)
  | undefined => {
  if (!item.subMenuProps) {
    return item.onItemClick;
  }

  return (ev, itemKey) => {
    if (item.subMenuProps) {
      subMenuCallback(item.subMenuProps);
    }
    // Still perform any onItemClick in addition to handling transform into sub menu
    item.onItemClick && item.onItemClick(ev, itemKey);
  };
};
