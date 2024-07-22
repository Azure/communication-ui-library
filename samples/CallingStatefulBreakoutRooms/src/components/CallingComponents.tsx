// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Features } from '@azure/communication-calling';
import {
  CameraButton,
  ControlBar,
  EndCallButton,
  MicrophoneButton,
  ScreenShareButton,
  useCall,
  usePropsFor,
  VideoGallery,
  VideoStreamOptions
} from '@azure/communication-react';
import { IContextualMenuItem, IContextualMenuProps, Stack } from '@fluentui/react';
import React, { useCallback, useState } from 'react';

export type CallingComponentsProps = {
  returnToMainMeeting?: () => Promise<void>;
  hangUpMainMeeting?: () => Promise<void>;
};

export const CallingComponents = (props: CallingComponentsProps): JSX.Element => {
  const call = useCall();

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

  // Breakout room menu items
  const breakoutRoomMenuItems: IContextualMenuItem[] = [];
  if (props.returnToMainMeeting) {
    breakoutRoomMenuItems.push({
      key: 'leaveRoom',
      text: 'Leave room',
      title: 'Leave room',
      onClick: () => {
        props.returnToMainMeeting?.();
      }
    });
  }
  if (props.hangUpMainMeeting) {
    breakoutRoomMenuItems.push({
      key: 'leaveMeeting',
      text: 'Leave meeting',
      title: 'Leave meeting',
      onClick: () => {
        props.hangUpMainMeeting?.().then(() => {
          onHangup();
        });
      }
    });
  }

  const breakoutRoomMenuProps: IContextualMenuProps | undefined =
    call?.feature(Features.BreakoutRooms).breakoutRoomSettings?.disableReturnToMainMeeting === false
      ? {
          items: breakoutRoomMenuItems
        }
      : undefined;

  return (
    <Stack style={{ height: '100%' }}>
      {videoGalleryProps && (
        <Stack style={{ height: '100vh' }}>
          <VideoGallery
            {...videoGalleryProps}
            localVideoViewOptions={localVideoViewOptions}
            remoteVideoViewOptions={remoteVideoViewOptions}
          />
        </Stack>
      )}
      <ControlBar layout="floatingBottom">
        {cameraProps && <CameraButton {...cameraProps} />}
        {microphoneProps && <MicrophoneButton {...microphoneProps} />}
        {screenShareProps && <ScreenShareButton {...screenShareProps} />}
        {endCallProps && <EndCallButton {...endCallProps} onHangUp={onHangup} menuProps={breakoutRoomMenuProps} />}
      </ControlBar>
    </Stack>
  );
};

function CallEnded(): JSX.Element {
  return <h1>You ended the call.</h1>;
}

export default CallingComponents;
