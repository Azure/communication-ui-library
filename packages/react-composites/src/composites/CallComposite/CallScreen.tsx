// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  activeContainerClassName,
  containerStyles,
  callControlsStyles,
  subContainerStyles,
  callControlsContainer
} from './styles/CallScreen.styles';

import { MediaGallery } from './MediaGallery';
import { isInCall } from '../../utils/SDKUtils';
import { complianceBannerSelector } from './selectors/complianceBannerSelector';
import { useAdapter } from './adapter/CallAdapterProvider';
import { useSelector } from './hooks/useSelector';
import { getCall } from './selectors/baseSelectors';
import { callStatusSelector } from './selectors/callStatusSelector';
import { mediaGallerySelector } from './selectors/mediaGallerySelector';
import { useHandlers } from './hooks/useHandlers';
import { PlaceholderProps, VideoStreamOptions } from 'react-components';
import { CallControls } from './CallControls';
import { ComplianceBanner } from './ComplianceBanner';
import { lobbySelector } from './selectors/lobbySelector';
import { Lobby } from './Lobby';
import { AzureCommunicationCallAdapter, CallCompositePage } from './adapter';
import { PermissionsBanner } from '../common/PermissionsBanner';
import { permissionsBannerContainerStyle } from '../common/styles/PermissionsBanner.styles';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { ScreenSharePopup } from './ScreenSharePopup';

export const MINI_HEADER_WINDOW_WIDTH = 450;

export interface CallScreenProps {
  callInvitationURL?: string;
  screenWidth: number;
  showParticipants?: boolean;
  showPane?: boolean;
  endCallHandler(): void;
  callErrorHandler(customPage?: CallCompositePage): void;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  onRenderPane?: () => JSX.Element;
}

const spinnerLabel = 'Initializing call client...';

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const {
    callInvitationURL,
    screenWidth,
    showParticipants,
    showPane,
    endCallHandler,
    callErrorHandler,
    onRenderAvatar,
    onRenderPane
  } = props;

  const [joinedCall, setJoinedCall] = useState<boolean>(false);

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  const { callStatus, isScreenShareOn } = useSelector(callStatusSelector);
  const call = useSelector(getCall);
  const currentCallId = useRef('');
  if (call) {
    currentCallId.current = call.id;
  }

  const mediaGalleryProps = useSelector(mediaGallerySelector);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  const complianceBannerProps = useSelector(complianceBannerSelector);

  const lobbyProps = useSelector(lobbySelector);
  const lobbyHandlers = useHandlers(Lobby);

  const devicePermissions = useSelector(devicePermissionSelector);

  const localVideoViewOption = {
    scalingMode: 'Crop',
    isMirrored: true
  } as VideoStreamOptions;

  const adapter = useAdapter();

  useEffect(() => {
    if (!joinedCall) {
      adapter.joinCall();
    }
    setJoinedCall(true);
  }, [adapter, joinedCall]);

  // Handle Call Join Errors
  useEffect(() => {
    const endedCall = adapter.getState().endedCall;
    if (endedCall && currentCallId.current === endedCall?.id) {
      if (endedCall?.callEndReason?.code === 0 && endedCall?.callEndReason.subCode === 5854) {
        callErrorHandler('errorJoiningTeamsMeeting');
      } else if (endedCall?.callEndReason?.code === 0 && endedCall?.callEndReason?.subCode === 5300) {
        callErrorHandler('removed');
      }
    }
  }, [adapter, call, callErrorHandler]);

  if ('isTeamsCall' in adapter) {
    const azureAdapter = adapter as AzureCommunicationCallAdapter;
    const callState = azureAdapter.getState().call?.state;
    if (
      azureAdapter.isTeamsCall() &&
      callState !== undefined &&
      azureAdapter.getState().call &&
      ['Connecting', 'Ringing', 'InLobby'].includes(callState)
    ) {
      return (
        <Lobby
          callState={callState}
          {...lobbyProps}
          {...lobbyHandlers}
          onEndCallClick={endCallHandler}
          isMicrophoneChecked={azureAdapter.getState().isLocalPreviewMicrophoneEnabled}
          localVideoViewOption={localVideoViewOption}
        />
      );
    }
  }

  return (
    <>
      {isInCall(callStatus ?? 'None') ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles}>
          <Stack.Item style={{ width: '100%' }}>
            <ComplianceBanner {...complianceBannerProps} />
          </Stack.Item>
          <Stack.Item style={permissionsBannerContainerStyle}>
            <PermissionsBanner
              microphonePermissionGranted={devicePermissions.audio}
              cameraPermissionGranted={devicePermissions.video}
            />
          </Stack.Item>
          <Stack.Item styles={subContainerStyles} grow>
            {callStatus === 'Connected' && (
              <>
                <Stack styles={containerStyles} horizontal={true}>
                  <Stack.Item grow={3} styles={activeContainerClassName} style={{ textAlign: 'left', width: '70%' }}>
                    <MediaGallery {...mediaGalleryProps} {...mediaGalleryHandlers} onRenderAvatar={onRenderAvatar} />
                  </Stack.Item>
                  {showPane && onRenderPane && (
                    <Stack.Item style={{ textAlign: 'right', width: '30%', borderLeft: '1px solid #333' }} grow={1}>
                      {onRenderPane()}
                    </Stack.Item>
                  )}
                </Stack>
                {isScreenShareOn && (
                  <ScreenSharePopup
                    onStopScreenShare={() => {
                      return adapter.stopScreenShare();
                    }}
                  />
                )}
              </>
            )}
          </Stack.Item>
          <Stack.Item styles={callControlsStyles}>
            <Stack className={callControlsContainer}>
              <CallControls
                onEndCallClick={endCallHandler}
                compressedMode={screenWidth <= MINI_HEADER_WINDOW_WIDTH}
                showParticipants={showParticipants}
                callInvitationURL={callInvitationURL}
              />
            </Stack>
          </Stack.Item>
        </Stack>
      ) : (
        <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />
      )}
    </>
  );
};
