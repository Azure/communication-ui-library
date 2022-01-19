// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../../types';
import { DrawerContentContainer } from './DrawerContentContainer';
import { DrawerLightDismiss } from './DrawerLightDismiss';

/**
 * Styles for the {@link ParticipantList}.
 *
 * @beta
 */
export interface DrawerStyles extends BaseCustomStyles {
  /** Styles for the container of the {@link Drawer} content. */
  drawerContentRoot?: BaseCustomStyles;
}

/**
 * Props for {@link Drawer} component.
 *
 * @beta
 */
export interface DrawerProps {
  /** Content of the Drawer */
  children: React.ReactNode;

  /**
   * Callback when the drawer's light-dismissal is triggered.
   */
  onLightDismiss?: () => void;

  /** Styles for the {@link Drawer} */
  styles?: DrawerStyles;
}

/**
 * A `Drawer` can be used to reveal lightweight views inside your application.
 * They appear from the bottom of the screen upwards and are light-dismissed.
 *
 * @beta
 */
export const Drawer = (props: DrawerProps): JSX.Element => {
  const rootStyles = mergeStyles(drawerBackgroundStyles, props.styles?.root);

  return (
    // A11y TODO: Add focus trap zone.
    // A11y TODO: Add navigator announcement.
    // A11y TODO: Ensure onLightDismiss is triggered by escape key.
    <Stack verticalFill className={rootStyles}>
      {props.onLightDismiss && <DrawerLightDismiss onDismiss={props.onLightDismiss} />}
      <DrawerContentContainer styles={props.styles?.drawerContentRoot}>{props.children}</DrawerContentContainer>
    </Stack>
  );
};

const drawerBackgroundStyles: IStyle = {
  position: 'absolute',
  bottom: 0,
  width: '100%',
  background: 'rgba(0,0,0,0.4)'
};
