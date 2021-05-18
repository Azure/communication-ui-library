// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { StreamMedia, VideoTile } from 'react-components';
import { OutgoingCallControlBarComponent } from '../common/CallControls';
import { MapToLocalVideoProps } from '../../consumers';
import { useCallContext, useCallingContext } from '../../providers';
import { MapToCallControlBarProps } from '../common/consumers/MapToCallControlBarProps';
import { useMicrophone } from '../../hooks';

export interface OutgoingCallScreenProps {
  callState: string;
  endCallHandler: () => void;
}

export const OutgoingCallScreen = (props: OutgoingCallScreenProps): JSX.Element => {
  const { callState, endCallHandler } = props;
  const { localVideoStream, isLocalVideoOn, isMicrophoneEnabled } = useCallContext();
  const { videoDeviceInfo, audioDeviceInfo } = useCallingContext();
  const { unmute } = useMicrophone();
  const { startLocalVideo, stopLocalVideo } = MapToCallControlBarProps();
  const { isVideoReady, videoStreamElement } = MapToLocalVideoProps({
    stream: localVideoStream,
    scalingMode: 'Crop'
  });

  useEffect(() => {
    isMicrophoneEnabled && audioDeviceInfo && unmute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioDeviceInfo]);

  useEffect(() => {
    isLocalVideoOn && videoDeviceInfo && startLocalVideo();
    return () => {
      isVideoReady && stopLocalVideo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoDeviceInfo]);

  return (
    <VideoTile
      styles={{ root: { height: '100%', width: '100%' }, videoContainer: { zIndex: -1 } }}
      renderElement={<StreamMedia videoStreamElement={videoStreamElement} />}
      isVideoReady={isVideoReady}
      placeholder={<></>}
    >
      <Stack style={{ width: '100%', height: '100%', background: 'rgb(0, 0, 0, 0.5)' }}>
        <p
          style={{
            fontSize: '1.75rem',
            margin: 'auto',
            color: 'white',
            fontWeight: 500
          }}
        >
          {callState}...
        </p>
        <OutgoingCallControlBarComponent
          layout={'floatingBottom'}
          styles={{
            root: { background: 'white' }
          }}
          onEndCallClick={endCallHandler}
        />
      </Stack>
    </VideoTile>
  );
};
