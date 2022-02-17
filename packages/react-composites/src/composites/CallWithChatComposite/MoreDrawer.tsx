// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { _DrawerMenu as DrawerMenu, _DrawerMenuItemProps as DrawerMenuItemProps } from '@internal/react-components';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';

/** @private */
export interface MoreDrawerProps {
  onLightDismiss: () => void;
  onPeopleButtonClicked: () => void;
}

/** @private */
export const MoreDrawer = (props: MoreDrawerProps): JSX.Element => {
  const strings = useCallWithChatCompositeStrings();
  const drawerMenuItems: DrawerMenuItemProps[] = [
    {
      key: 'people',
      text: strings.peopleButtonLabel,
      iconProps: { iconName: 'MoreDrawerPeople' },
      onItemClick: props.onPeopleButtonClicked
    }
  ];
  return <DrawerMenu items={drawerMenuItems} onLightDismiss={props.onLightDismiss} />;
};
