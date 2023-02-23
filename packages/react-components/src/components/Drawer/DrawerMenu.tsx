// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { merge, Stack } from '@fluentui/react';
import React, { useCallback, useMemo, useState } from 'react';
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

  /**
   * String to show in heading of drawer menu
   */
  heading?: string;

  styles?: _DrawerMenuStyles;
}

/**
 * Takes a set of menu items and returns a created menu inside a {@link _DrawerSurface}.
 *
 * @internal
 */
export const _DrawerMenu = (props: _DrawerMenuProps): JSX.Element => {
  // This component breaks from a pure component pattern in order to internally support sub menus.
  // When a sub menu item is clicked the menu items displayed is updated to be that of the submenu.
  // To track this state we store a list of the keys clicked up until this point.
  const [selectedKeyPath, setSelectedKeyPath] = useState<string[]>([]);

  // Get the menu items that should be rendered
  const menuItemsToRender = useMemo(() => {
    let items: _DrawerMenuItemProps[] | undefined = props.items;
    for (const subMenuKey of selectedKeyPath) {
      items = items?.find((item) => item.itemKey === subMenuKey)?.subMenuProps;
    }
    return items;
  }, [props.items, selectedKeyPath]);

  // When an item is clicked and it contains a submenu, push the key for the submenu. This will ensure
  // a new render is triggered, menuItemsToRender will be re-calculated and the submenu will render.
  const onItemClick = useCallback(
    (
      item: _DrawerMenuItemProps,
      ev?: React.MouseEvent<HTMLElement, MouseEvent> | React.KeyboardEvent<HTMLElement> | undefined,
      itemKey?: string | undefined
    ): void => {
      if (item.subMenuProps) {
        setSelectedKeyPath([...selectedKeyPath, item.itemKey]);
      }

      item.onItemClick?.(ev, itemKey);
    },
    [selectedKeyPath]
  );

  // Ensure the first item has a border radius that matches the DrawerSurface
  const borderRadius = useTheme().effects.roundedCorner4;
  const firstItemStyle = menuItemsToRender && menuItemsToRender[0]?.styles;
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
      styles={props.styles?.drawerSurfaceStyles}
      onLightDismiss={props.onLightDismiss}
      heading={props.heading}
    >
      <Stack styles={props.styles} role="menu" data-ui-id="drawer-menu">
        {menuItemsToRender?.slice(0, 1).map((item) => (
          <DrawerMenuItem
            {...item}
            key={'0'}
            styles={modifiedFirstItemStyle}
            onItemClick={(ev, itemKey) => {
              onItemClick(item, ev, itemKey);
            }}
          />
        ))}
        {menuItemsToRender?.slice(1).map((item, i) => (
          <DrawerMenuItem
            {...item}
            key={`${i + 1}`}
            onItemClick={(ev, itemKey) => {
              onItemClick(item, ev, itemKey);
            }}
          />
        ))}
      </Stack>
    </_DrawerSurface>
  );
};
