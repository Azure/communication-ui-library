// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _DrawerMenu } from '@internal/react-components';
import React from 'react';

/**
 * @private
 */
export interface VideoTileDrawerMenuProps {
  onLightDismiss: () => void;
  onFitRemoteVideo: () => void;
  onFillRemoteVideo: () => void;
}

/**
 * @private
 */
export const VideoTileDrawerMenu = (props: VideoTileDrawerMenuProps): JSX.Element => {
  return (
    <_DrawerMenu
      onLightDismiss={props.onLightDismiss}
      items={[
        {
          itemKey: 'fitFill',
          text: 'Fit/Fill',
          iconProps: { iconName: 'FitFillIcon' },
          onItemClick: () => console.log('fitFill')
        }
      ]}
    />
  );
};
