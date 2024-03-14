// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, useTheme } from '@fluentui/react';
import { CallAdapter, CallComposite, CallCompositeOptions } from '../../CallComposite';
import { callingWidgetInCallContainerStyles } from '../styles/CallingWidgetComposite.styles';
import React from 'react';
import { WidgetPosition } from '../CallingWidgetComposite';

export interface CallScreenProps {
  adapter: CallAdapter;
  useLocalVideo: boolean;
  options?: CallCompositeOptions;
  position: WidgetPosition;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { adapter, options, useLocalVideo, position } = props;
  const theme = useTheme();
  return (
    <Stack styles={callingWidgetInCallContainerStyles(theme, position)}>
      <Stack style={{ position: position === 'unset' ? 'relative' : 'unset' }} id="test">
        <CallComposite
          adapter={adapter}
          options={{
            ...options,
            callControls: options?.callControls
              ? options.callControls
              : {
                  cameraButton: useLocalVideo,
                  screenShareButton: useLocalVideo,
                  raiseHandButton: false,
                  moreButton: false,
                  peopleButton: false,
                  displayType: 'compact'
                },
            localVideoTile: options?.localVideoTile
              ? options.localVideoTile
              : !useLocalVideo
              ? false
              : { position: 'floating' }
          }}
        />
      </Stack>
    </Stack>
  );
};
