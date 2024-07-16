// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  usePropsFor,
  VideoGallery,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  ScreenShareButton,
  EndCallButton,
  VideoStreamOptions
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useCallback, useState } from 'react';

export const CallingComponents = (): JSX.Element => {
  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);

  const [callEnded, setCallEnded] = useState(false);

  const localVideoViewOptions = {
    scalingMode: 'Crop',
    isMirrored: true
  } as VideoStreamOptions;

  const remoteVideoViewOptions = {
    scalingMode: 'Crop'
  } as VideoStreamOptions;

  const onHangup = useCallback(async (): Promise<void> => {
    await endCallProps.onHangUp();
    setCallEnded(true);
  }, [endCallProps]);

  if (callEnded) {
    return <CallEnded />;
  }

  return (
    <Stack style={{ height: '100%' }}>
      {videoGalleryProps && (
        <Stack style={{ height: '100%' }}>
          <VideoGallery
            {...videoGalleryProps}
            styles={VideoGalleryStyles}
            layout={'floatingLocalVideo'}
            localVideoViewOptions={localVideoViewOptions}
            remoteVideoViewOptions={remoteVideoViewOptions}
          />
        </Stack>
      )}
      <ControlBar layout={'dockedBottom'}>
        {cameraProps && <CameraButton {...cameraProps} />}
        {microphoneProps && <MicrophoneButton {...microphoneProps} />}
        {screenShareProps && <ScreenShareButton {...screenShareProps} />}
        {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} />}
      </ControlBar>
    </Stack>
  );
};

function CallEnded(): JSX.Element {
  return <h1>You ended the call.</h1>;
}

export default CallingComponents;

const VideoGalleryStyles = {
  root: {
    height: '100%',
    width: '100%',
    minHeight: '10rem', // space affordance to ensure media gallery is never collapsed
    minWidth: '6rem'
  }
};
