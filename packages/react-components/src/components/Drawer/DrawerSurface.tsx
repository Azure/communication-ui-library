// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FocusTrapZone, IStyle, mergeStyles, Stack } from '@fluentui/react';
import React from 'react';
import { BaseCustomStyles } from '../../types';
import { DrawerContentContainer } from './DrawerContentContainer';
import { DrawerLightDismiss } from './DrawerLightDismiss';

/**
 * Styles for the {@link _DrawerSurface}.
 *
 * @internal
 */
export interface _DrawerSurfaceStyles extends BaseCustomStyles {
  /** Styles for the root of the container of the {@link DrawerSurface} content. */
  drawerContentRoot?: BaseCustomStyles;
  /** Styles for the container of the {@link DrawerSurface} content. */
  drawerContentContainer?: BaseCustomStyles;
  /** Styles for the light dismiss element of the {@link DrawerSurface}. */
  lightDismissRoot?: BaseCustomStyles;
}

/**
 * Props for {@link DrawerSurface} component.
 *
 * @internal
 */
export interface _DrawerSurfaceProps {
  /** Content of the Drawer */
  children: React.ReactNode;

  /**
   * Callback when the drawer's light-dismissal is triggered.
   */
  onLightDismiss: () => void;

  /** Styles for the {@link DrawerSurface} */
  styles?: _DrawerSurfaceStyles;
}

/**
 * A `Drawer` can be used to reveal lightweight views inside your application.
 * They appear from the bottom of the screen upwards and are light-dismissed.
 *
 * @internal
 */
export const _DrawerSurface = (props: _DrawerSurfaceProps): JSX.Element => {
  const rootStyles = mergeStyles(drawerSurfaceStyles, props.styles?.root);

  return (
    <Stack className={rootStyles}>
      <DrawerLightDismiss styles={props.styles?.lightDismissRoot} onDismiss={props.onLightDismiss} />
      <FocusTrapZone
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Esc') {
            props.onLightDismiss && props.onLightDismiss();
          }
        }}
      >
        <DrawerContentContainer styles={props.styles?.drawerContentContainer}>{props.children}</DrawerContentContainer>
      </FocusTrapZone>
    </Stack>
  );
};

const drawerSurfaceStyles: IStyle = {
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.4)'
};
