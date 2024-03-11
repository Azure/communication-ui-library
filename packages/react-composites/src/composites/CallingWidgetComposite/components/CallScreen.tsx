// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, useTheme } from '@fluentui/react';
import { CallAdapter, CallComposite, CallCompositeOptions } from '../../CallComposite';
import { callingWidgetInCallContainerStyles } from '../styles/CallingWidgetComposite.styles';
import React from 'react';

export interface CallScreenProps {
  adapter: CallAdapter;
  options: CallCompositeOptions;
  useLocalVideo: boolean;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { adapter, options, useLocalVideo } = props;
  const theme = useTheme();
  return (
    <Stack styles={callingWidgetInCallContainerStyles(theme)}>
      <CallComposite
        adapter={adapter}
        options={
          options
            ? options
            : {
                callControls: {
                  cameraButton: useLocalVideo,
                  screenShareButton: useLocalVideo,
                  moreButton: false,
                  peopleButton: false,
                  displayType: 'compact'
                },
                localVideoTile: !useLocalVideo ? false : { position: 'floating' }
              }
        }
      />
    </Stack>
  );
};
