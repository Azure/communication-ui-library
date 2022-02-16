// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _DrawerMenu as DrawerMenu, _DrawerMenuItemProps as DrawerMenuItemProps } from '@internal/react-components';

/** @private */
export interface MoreDrawerProps {
  onLightDismiss: () => void;
}

/** @private */
export const MoreDrawer = (props: MoreDrawerProps): JSX.Element => {
  // xkcd: FIXME.
  const drawerMenuItems: DrawerMenuItemProps[] = [
    {
      key: 'raiseHand',
      text: 'Raise hand',
      iconProps: { iconName: 'RightHand' },
      onItemClick: props.onLightDismiss
    }
  ];
  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};
