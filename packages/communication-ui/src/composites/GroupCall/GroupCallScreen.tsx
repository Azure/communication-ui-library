// © Microsoft Corporation. All rights reserved.

import { Label, Spinner, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import {
  activeContainerClassName,
  containerStyles,
  headerStyles,
  loadingStyle,
  subContainerStyles,
  headerCenteredContainer,
  headerContainer
} from './styles/GroupCallScreen.styles';

import { HangupCallOptions } from '@azure/communication-calling';
import MediaGallery from './MediaGallery';
import { isInCall, isLocalScreenShareSupportedInBrowser } from '../../utils/SDKUtils';
import { GroupCallContainerProps } from './consumers/MapToGroupCallProps';
import { MapToMediaGalleryProps } from './consumers/MapToMediaGalleryProps';
import { MapToErrorBarProps } from '../../consumers/MapToErrorBarProps';
import MediaControls from './MediaControls';
import { MINI_HEADER_WINDOW_WIDTH } from '../../constants';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { WithErrorHandling } from '../../utils/WithErrorHandling';
import ErrorBar from '../../components/ErrorBar';
import { useActions, useSelector } from '../../providers';

export interface GroupCallProps extends GroupCallContainerProps {
  screenWidth: number;
  endCallHandler(): void;
  groupId: string;
}

const spinnerLabel = 'Initializing call client...';

const GroupCallComponentBase = (props: GroupCallProps & ErrorHandlingProps): JSX.Element => {
  const { isCallInitialized, callState, isLocalScreenSharingOn, groupId, screenWidth, endCallHandler } = props;

  useEffect(() => {
    if (isInCall(callState)) {
      document.title = `${groupId} group call sample`;
    }
  }, [callState, groupId]);

  // const mediaControlProps = MapToMediaControlsProps();
  const mediaControlProps = useSelector(({ call, devices }) => {
    return {
      isMicrophoneActive: call.isMicrophoneEnabled,
      localVideoEnabled: call.isLocalVideoOn,
      localVideoBusy: false, // todo or delete?
      isLocalScreenShareActive: call.localScreenShareActive,
      isRemoteScreenShareActive: false, //todo
      cameraPermission: devices.videoDevicePermission,
      micPermission: devices.audioDevicePermission
    };
  });

  const mediaControlActions = useActions((actions) => {
    return {
      unmuteMicrophone: actions.unmute,
      muteMicrophone: actions.mute,
      toggleMicrophone: actions.toggleMute,
      startLocalVideo: actions.startCamera,
      stopLocalVideo: actions.stopCamera,
      toggleLocalVideo: actions.toggleCameraOnOff,
      startScreenShare: actions.startScreenShare,
      stopScreenShare: actions.stopScreenShare,
      toggleScreenShare: actions.toggleScreenShare,
      leaveCall: (options?: HangupCallOptions) => actions.leaveCall(options?.forEveryone)
    };
  });

  const mediaGalleryProps = MapToMediaGalleryProps();
  const errorBarProps = MapToErrorBarProps();

  return (
    <>
      {isCallInitialized ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
          <Stack.Item styles={headerStyles}>
            <Stack className={props.screenWidth > MINI_HEADER_WINDOW_WIDTH ? headerContainer : headerCenteredContainer}>
              <MediaControls
                {...mediaControlProps}
                {...mediaControlActions}
                isLocalScreenShareSupportedInBrowser={isLocalScreenShareSupportedInBrowser}
                onEndCallClick={endCallHandler}
                compressedMode={screenWidth <= MINI_HEADER_WINDOW_WIDTH}
              />
            </Stack>
            <ErrorBar {...errorBarProps} />
          </Stack.Item>
          <Stack.Item styles={subContainerStyles} grow>
            {!isLocalScreenSharingOn ? (
              callState === 'Connected' && (
                <Stack styles={containerStyles} grow>
                  <Stack.Item grow styles={activeContainerClassName}>
                    <MediaGallery {...mediaGalleryProps} />
                  </Stack.Item>
                </Stack>
              )
            ) : (
              <div className={loadingStyle}>
                <Label>Your screen is being shared</Label>
              </div>
            )}
          </Stack.Item>
        </Stack>
      ) : (
        <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />
      )}
    </>
  );
};

const GroupCallComponent = (props: GroupCallProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(GroupCallComponentBase, props);

export default GroupCallComponent;
