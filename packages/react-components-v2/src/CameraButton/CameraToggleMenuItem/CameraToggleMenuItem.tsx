// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraToggleMenuItemProps } from './CameraToggleMenuItem.types';
import { ForwardRefComponent, MenuItem, resolveShorthand } from '@fluentui/react-components';
import { _Announcer } from '../../Announcer/Announcer';
import { useLocale } from '../../localization';
import { Video20Filled, VideoOff20Filled } from '@fluentui/react-icons';

/**
 * Menu item designed with appropriate defaults and localization support to be used as a heading for camera functionality in a menu.
 *
 * @public
 */
export const CameraToggleMenuItem: ForwardRefComponent<CameraToggleMenuItemProps> = React.forwardRef((props, ref) => {
  const { cameraOn, onToggleCamera, ...restOfProps } = props;
  const strings = useLocale().strings.cameraToggleMenuItem;

  const menuItemProps = resolveShorthand(restOfProps, {
    required: true,
    defaultProps: {
      children: cameraOn ? strings.cameraOnLabel : strings.cameraOffLabel,
      icon: cameraOn ? <Video20Filled /> : <VideoOff20Filled />,
      onClick: (ev) => onToggleCamera(ev, { cameraOn: props.cameraOn })
    }
  });

  return <MenuItem ref={ref} {...menuItemProps} />;
});

CameraToggleMenuItem.displayName = 'CameraToggleMenuItem';
