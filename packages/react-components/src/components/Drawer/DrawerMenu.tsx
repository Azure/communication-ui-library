// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { merge, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
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
 * TODO: should this be publicly exported or allow the drawer to have a contentType=menu and takes in these props.
 *
 * @internal
 */
export const _DrawerMenu = (props: _DrawerMenuProps): JSX.Element => {
  const firstItemStyle = props.items[0]?.styles;

  // Ensure the first item has a border radius that matches the DrawerSurface
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
        {props.items.slice(0, 1).map((item) => (
          // Design TODO: first item needs border radius applied
          <DrawerMenuItem {...item} key={item.key} styles={modifiedFirstItemStyle} />
        ))}
        {props.items.slice(1).map((item) => (
          <DrawerMenuItem {...item} key={item.key} />
        ))}
      </Stack>
    </_DrawerSurface>
  );
};
