// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  mediaGalleryContainerStyles,
  containerStyles,
  callControlsStyles,
  subContainerStyles,
  callControlsContainer,
  sidePaneContainerStyles
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
import { PlaceholderProps, VideoStreamOptions } from '@internal/react-components';
import { CallControls } from './CallControls';
import { ComplianceBanner } from './ComplianceBanner';
import { lobbySelector } from './selectors/lobbySelector';
import { Lobby } from './Lobby';
import { AzureCommunicationCallAdapter, CallCompositePage } from './adapter';
import { PermissionsBanner } from '../common/PermissionsBanner';
import { permissionsBannerContainerStyle } from '../common/styles/PermissionsBanner.styles';
import { devicePermissionSelector } from './selectors/devicePermissionSelector';
import { ScreenSharePopup } from './ScreenSharePopup';

export interface CallScreenProps {
  callInvitationURL?: string;
  showParticipantsButton?: boolean;
  endCallHandler(): void;
  callErrorHandler(customPage?: CallCompositePage): void;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
  onRenderPane?: () => JSX.Element;
  showSideChatButton?: boolean;
  showSidePeopleButton?: boolean;
  chatButtonChecked?: boolean;
  peopleButtonChecked?: boolean;
  onChatButtonClick?: () => void;
  onPeopleButtonClick?: () => void;
}

const spinnerLabel = 'Initializing call client...';

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const {
    callInvitationURL,
    showParticipantsButton,
    endCallHandler,
    callErrorHandler,
    onRenderAvatar,
    onRenderPane,
    showSideChatButton,
    showSidePeopleButton,
    chatButtonChecked,
    peopleButtonChecked,
    onChatButtonClick,
    onPeopleButtonClick
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
    <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
      {isInCall(callStatus ?? 'None') ? (
        <>
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
                <Stack styles={containerStyles} horizontal>
                  <Stack.Item styles={mediaGalleryContainerStyles}>
                    <MediaGallery {...mediaGalleryProps} {...mediaGalleryHandlers} onRenderAvatar={onRenderAvatar} />
                  </Stack.Item>
                  {onRenderPane && <Stack.Item styles={sidePaneContainerStyles}>{onRenderPane()}</Stack.Item>}
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
                showParticipantsButton={showParticipantsButton}
                callInvitationURL={callInvitationURL}
                showSideChatButton={showSideChatButton}
                showSidePeopleButton={showSidePeopleButton}
                chatButtonChecked={chatButtonChecked}
                peopleButtonChecked={peopleButtonChecked}
                onChatButtonClick={onChatButtonClick}
                onPeopleButtonClick={onPeopleButtonClick}
              />
            </Stack>
          </Stack.Item>
        </>
      ) : (
        <Spinner label={spinnerLabel} ariaLive="assertive" labelPosition="top" />
      )}
    </Stack>
  );
};
