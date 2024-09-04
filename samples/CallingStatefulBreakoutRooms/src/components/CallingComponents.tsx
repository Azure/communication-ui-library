// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Features } from '@azure/communication-calling';
import {
  usePropsFor,
  VideoGallery,
  ControlBar,
  CameraButton,
  MicrophoneButton,
  NotificationStack,
  ScreenShareButton,
  EndCallButton,
  VideoStreamOptions,
  useCall
} from '@azure/communication-react';
import { IStackStyles, PrimaryButton, Stack } from '@fluentui/react';
import React, { useCallback, useState } from 'react';

export type CallingComponentsProps = {
  returnToMainMeeting?: () => Promise<void>;
};

export const CallingComponents = (props: CallingComponentsProps): JSX.Element => {
  const call = useCall();

  const videoGalleryProps = usePropsFor(VideoGallery);
  const cameraProps = usePropsFor(CameraButton);
  const microphoneProps = usePropsFor(MicrophoneButton);
  const screenShareProps = usePropsFor(ScreenShareButton);
  const endCallProps = usePropsFor(EndCallButton);
  const notificationProps = usePropsFor(NotificationStack);

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

  let breakoutRoomMenuProps = undefined;
  // Breakout room menu items are shown only if the breakout room settings allow returning to the main meeting
  if (
    props.returnToMainMeeting &&
    call?.feature(Features.BreakoutRooms).breakoutRoomsSettings?.disableReturnToMainMeeting === false
  ) {
    breakoutRoomMenuProps = {
      items: [
        {
          key: 'leaveRoom',
          text: 'Leave room',
          title: 'Leave room',
          onClick: () => {
            props.returnToMainMeeting?.();
          }
        },
        {
          key: 'leaveMeeting',
          text: 'Leave meeting',
          title: 'Leave meeting',
          onClick: () => onHangup()
        }
      ]
    };
  }

  const assignedBreakoutRoom = call?.feature(Features.BreakoutRooms).assignedBreakoutRooms;

  return (
    <Stack style={{ height: '100%' }}>
      {videoGalleryProps && (
        <Stack verticalAlign="center" style={{ height: '100%' }}>
          <Stack styles={NotificationStackContainerStyles}>
            <NotificationStack {...notificationProps} />
          </Stack>
          <VideoGallery
            {...videoGalleryProps}
            styles={VideoGalleryStyles}
            layout={'floatingLocalVideo'}
            localVideoViewOptions={localVideoViewOptions}
            remoteVideoViewOptions={remoteVideoViewOptions}
          />
          <Stack>
            <ControlBar layout={'floatingBottom'}>
              {assignedBreakoutRoom?.state === 'open' && assignedBreakoutRoom.call && (
                <PrimaryButton
                  text="Join breakout room"
                  onClick={() => assignedBreakoutRoom.join()}
                  style={{ height: '3.5rem' }}
                />
              )}
              {cameraProps && <CameraButton {...cameraProps} />}
              {microphoneProps && <MicrophoneButton {...microphoneProps} />}
              {screenShareProps && <ScreenShareButton {...screenShareProps} />}
              {endCallProps && (
                <EndCallButton {...endCallProps} onHangUp={onHangup} menuProps={breakoutRoomMenuProps} />
              )}
            </ControlBar>
          </Stack>
        </Stack>
      )}
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

const NotificationStackContainerStyles: IStackStyles = {
  root: {
    zIndex: 1,
    position: 'absolute',
    top: '2rem',
    left: '50%',
    transform: 'translate(-50%, 0)'
  }
};
