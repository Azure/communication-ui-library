// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _DrawerMenu as DrawerMenu, _DrawerMenuItemProps as DrawerMenuItemProps } from '@internal/react-components';

/** @private */
export interface MoreDrawerStrings {
  peopleButtonLabel: string;
}

/** @private */
export interface MoreDrawerProps {
  onLightDismiss: () => void;
  onPeopleButtonClicked: () => void;

  strings: MoreDrawerStrings;
}

/** @private */
export const MoreDrawer = (props: MoreDrawerProps): JSX.Element => {
  const drawerMenuItems: DrawerMenuItemProps[] = [
    {
      key: 'people',
      text: props.strings.peopleButtonLabel,
      iconProps: { iconName: 'MoreDrawerPeople' },
      onItemClick: props.onPeopleButtonClicked
    }
  ];
  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};
