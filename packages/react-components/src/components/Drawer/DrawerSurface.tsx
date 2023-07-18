// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FocusTrapZone, IStyle, mergeStyles, mergeStyleSets, Stack } from '@fluentui/react';
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

  /**
   * String to show in heading of drawer surface
   */
  heading?: string;

  /**
   * By default, maxHeight value is set to 75%.
   * Set value to true for no default maxHeight to be applied on drawerSurface
   */
  disableMaxHeight?: boolean;

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
  const rootStyles = props.disableMaxHeight
    ? mergeStyles(drawerSurfaceStyles, props.styles?.root)
    : mergeStyles(drawerSurfaceStyles, focusTrapZoneStyles, props.styles?.root);
  const containerStyles = mergeStyleSets(drawerContentContainerStyles, props.styles?.drawerContentContainer);

  return (
    <Stack className={rootStyles}>
      <DrawerLightDismiss styles={props.styles?.lightDismissRoot} onDismiss={props.onLightDismiss} />
      <FocusTrapZone
        onKeyDown={(e) => {
          if (e.key === 'Escape' || e.key === 'Esc') {
            props.onLightDismiss && props.onLightDismiss();
          }
        }}
        // Ensure when the focus trap has focus, the light dismiss area can still be clicked with mouse to dismiss.
        // Note: this still correctly captures keyboard focus, this just allows mouse click outside of the focus trap.
        isClickableOutsideFocusTrap={true}
      >
        <DrawerContentContainer styles={containerStyles} heading={props.heading}>
          {props.children}
        </DrawerContentContainer>
      </FocusTrapZone>
    </Stack>
  );
};

const drawerSurfaceStyles: IStyle = {
  width: '100%',
  height: '100%',
  background: 'rgba(0,0,0,0.4)'
};

const focusTrapZoneStyles: IStyle = {
  // Targets FocusTrapZone in drawer.
  // Setting percentage to Height to transform a container does not work unless the
  // direct parent container also has a Height set other than 'auto'.
  '> div:nth-child(2)': {
    maxHeight: '75%',
    overflow: 'auto'
  }
};

const drawerContentContainerStyles: BaseCustomStyles = {
  root: {
    // Needed to fill max height from parent, drawerSurfaceStyles
    height: '100%'
  }
};
