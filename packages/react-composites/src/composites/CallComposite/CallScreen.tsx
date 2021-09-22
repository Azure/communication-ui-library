// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  mediaGalleryContainerStyles,
  containerStyles,
  subContainerStyles,
  callControlsContainer,
  bannersContainerStyles
} from './styles/CallScreen.styles';

import { MediaGallery } from './MediaGallery';
import { isInCall } from '../../utils/SDKUtils';
import { complianceBannerSelector } from './selectors/complianceBannerSelector';
import { useAdapter } from './adapter/CallAdapterProvider';
import { useSelector } from './hooks/useSelector';
import { getCallId, getEndedCall } from './selectors/baseSelectors';
import { callStatusSelector } from './selectors/callStatusSelector';
import { mediaGallerySelector } from './selectors/mediaGallerySelector';
import { useHandlers } from './hooks/useHandlers';
import { ErrorBar, OnRenderAvatarCallback, VideoStreamOptions } from '@internal/react-components';
import { CallControls } from './CallControls';
import { ComplianceBanner } from './ComplianceBanner';
import { lobbySelector } from './selectors/lobbySelector';
import { Lobby } from './Lobby';
import { CallCompositePage } from './adapter/CallAdapter';
import { PermissionsBanner } from '../common/PermissionsBanner';
import { permissionsBannerContainerStyle } from '../common/styles/PermissionsBanner.styles';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { ScreenSharePopup } from './ScreenSharePopup';
import { AvatarPersonaDataCallback } from '../common/AvatarPersona';
import { usePropsFor } from './hooks/usePropsFor';
import { CallCompositeOptions } from './CallComposite';

export interface CallScreenProps {
  callInvitationURL?: string;
  endCallHandler(): void;
  callErrorHandler(customPage?: CallCompositePage): void;
  onRenderAvatar?: OnRenderAvatarCallback;
  onFetchAvatarPersonaData?: AvatarPersonaDataCallback;
  options?: CallCompositeOptions;
}

const spinnerLabel = 'Initializing call client...';

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { callInvitationURL, endCallHandler, callErrorHandler, onRenderAvatar, onFetchAvatarPersonaData, options } =
    props;

  const [joinedCall, setJoinedCall] = useState<boolean>(false);

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  const { callStatus, isScreenShareOn } = useSelector(callStatusSelector);
  const callId = useSelector(getCallId);
  const currentCallId = useRef('');

  // Remember last available callId
  if (callId) {
    currentCallId.current = callId;
  }

  const mediaGalleryProps = useSelector(mediaGallerySelector);
  const mediaGalleryHandlers = useHandlers(MediaGallery);
  const complianceBannerProps = useSelector(complianceBannerSelector);
  const errorBarProps = usePropsFor(ErrorBar);

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

  const endedCall = useSelector(getEndedCall);

  // Handle Call Join Errors
  useEffect(() => {
    if (endedCall && currentCallId.current === endedCall?.id) {
      if (endedCall?.callEndReason?.code === 0 && endedCall?.callEndReason.subCode === 5854) {
        callErrorHandler('errorJoiningTeamsMeeting');
      } else if (endedCall?.callEndReason?.code === 0 && endedCall?.callEndReason?.subCode === 5300) {
        callErrorHandler('removed');
      }
    }
  }, [callErrorHandler, endedCall]);

  const adapterState = adapter.getState();
  const callState = adapterState.call?.state;
  if (adapterState.isTeamsCall && callState !== undefined && ['Connecting', 'Ringing', 'InLobby'].includes(callState)) {
    return (
      <Lobby
        callState={callState}
        {...lobbyProps}
        {...lobbyHandlers}
        onEndCallClick={endCallHandler}
        isMicrophoneChecked={adapterState.isLocalPreviewMicrophoneEnabled}
        localVideoViewOption={localVideoViewOption}
      />
    );
  }

  const screenShareModalHostId = 'UILibraryMediaGallery';
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
      {isInCall(callStatus ?? 'None') ? (
        <>
          <Stack.Item styles={bannersContainerStyles}>
            <Stack>
              <ComplianceBanner {...complianceBannerProps} />
            </Stack>
            <Stack style={permissionsBannerContainerStyle}>
              <PermissionsBanner
                microphonePermissionGranted={devicePermissions.audio}
                cameraPermissionGranted={devicePermissions.video}
              />
            </Stack>
            {options?.errorBar !== false && (
              <Stack>
                <ErrorBar {...errorBarProps} />
              </Stack>
            )}
          </Stack.Item>

          <Stack.Item styles={subContainerStyles} grow>
            {callStatus === 'Connected' && (
              <>
                <Stack id={screenShareModalHostId} grow styles={mediaGalleryContainerStyles}>
                  <MediaGallery
                    {...mediaGalleryProps}
                    {...mediaGalleryHandlers}
                    onRenderAvatar={onRenderAvatar}
                    onFetchAvatarPersonaData={onFetchAvatarPersonaData}
                  />
                </Stack>
                {isScreenShareOn ? (
                  <ScreenSharePopup
                    hostId={screenShareModalHostId}
                    onStopScreenShare={() => {
                      return adapter.stopScreenShare();
                    }}
                  />
                ) : (
                  <></>
                )}
              </>
            )}
          </Stack.Item>
          {options?.callControls !== false && (
            <Stack.Item className={callControlsContainer}>
              <CallControls
                onEndCallClick={endCallHandler}
                callInvitationURL={callInvitationURL}
                options={options?.callControls}
              />
            </Stack.Item>
          )}
        </>
      ) : (
        <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />
      )}
    </Stack>
  );
};
