// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Label, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  activeContainerClassName,
  containerStyles,
  headerStyles,
  loadingStyle,
  subContainerStyles,
  headerCenteredContainer,
  headerContainer
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

export const MINI_HEADER_WINDOW_WIDTH = 450;

export interface CallScreenProps {
  screenWidth: number;
  endCallHandler(): void;
  callErrorHandler(customPage?: CallCompositePage): void;
  onRenderAvatar?: (props: PlaceholderProps, defaultOnRender: (props: PlaceholderProps) => JSX.Element) => JSX.Element;
}

const spinnerLabel = 'Initializing call client...';

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { screenWidth, endCallHandler, callErrorHandler, onRenderAvatar } = props;

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
        <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
          <Stack.Item styles={headerStyles}>
            <Stack className={props.screenWidth > MINI_HEADER_WINDOW_WIDTH ? headerContainer : headerCenteredContainer}>
              <CallControls onEndCallClick={endCallHandler} compressedMode={screenWidth <= MINI_HEADER_WINDOW_WIDTH} />
            </Stack>
          </Stack.Item>
          <Stack.Item style={{ width: '100%' }}>
            <ComplianceBanner {...complianceBannerProps} />
          </Stack.Item>
          <Stack.Item styles={subContainerStyles} grow>
            {!isScreenShareOn ? (
              callStatus === 'Connected' && (
                <Stack styles={containerStyles} grow>
                  <Stack.Item grow styles={activeContainerClassName}>
                    <MediaGallery {...mediaGalleryProps} {...mediaGalleryHandlers} onRenderAvatar={onRenderAvatar} />
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
