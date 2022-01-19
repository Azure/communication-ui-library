// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../../types';
import { DrawerMenuItem, DrawerMenuItemProps } from './DrawerMenuItem';

/**
 * Props for the {@link DrawerMenu}
 *
 * @private
 */
export interface DrawerMenuProps {
  items: DrawerMenuItemProps[];
  styles: BaseCustomStyles;
}

/**
 * Takes a set of menu items and returns a created menu for use with the {@link Drawer}.
 *
 * TODO: should this be publicly exported or allow the drawer to have a contentType=menu and takes in these props.
 *
 * @private
 */
export const DrawerMenu = (props: DrawerMenuProps): JSX.Element => {
  return (
    <Stack styles={props.styles}>
      {props.items.map((item) => (
        // A11y TODO: autofocus the first element
        <DrawerMenuItem {...item} key={item.key} />
      ))}
    </Stack>
  );
};
