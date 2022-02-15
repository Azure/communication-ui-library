// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { merge, Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { _DrawerSurfaceProps } from '.';
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

  // Bind submenu handler to all items that have subMenuProps
  useEffect(() => {
    setOnItemClicks(menuItems.map((item) => bindSubmenuHandlerToItemIfApplicable(item, setMenuItems)));
  }, [menuItems]);

  // Ensure the first item has a border radius that matches the DrawerSurface
  const firstItemStyle = menuItems[0]?.styles;
  const modifiedFirstItemStyle = useMemo(
    () =>
      merge(firstItemStyle ?? {}, {
        root: { borderTopRightRadius: '0.375rem', borderTopLeftRadius: '0.375rem' }
      }),
    [firstItemStyle]
  );

  return (
    <_DrawerSurface styles={props.styles?.drawerSurfaceStyles} onLightDismiss={props.onLightDismiss}>
      <Stack styles={props.styles}>
        {menuItems.slice(0, 1).map((item) => (
          <DrawerMenuItem {...item} key={item.key} styles={modifiedFirstItemStyle} onItemClick={onItemClicks[0]} />
        ))}
        {menuItems.slice(1).map((item, i) => (
          <DrawerMenuItem {...item} key={item.key} onItemClick={onItemClicks[i + 1]} />
        ))}
      </Stack>
    </_DrawerSurface>
  );
};

const bindSubmenuHandlerToItemIfApplicable = (
  item: _DrawerMenuItemProps,
  subMenuCallback: (newItems: _DrawerMenuItemProps[]) => void
): (() => void) | undefined => {
  if (!item.subMenuProps) {
    return item.onItemClick;
  }

  return () => {
    if (item.subMenuProps) {
      subMenuCallback(item.subMenuProps);
    }
    // Still perform any onItemClick in addition to handling transform into sub menu
    item.onItemClick && item.onItemClick();
  };
};
