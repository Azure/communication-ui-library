// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Label, Spinner, Stack } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
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
import { connectFuncsToContext, MapToErrorBarProps } from '../../consumers';
import { isInCall } from '../../utils/SDKUtils';
import { ErrorHandlingProps } from '../../providers/ErrorProvider';
import { ErrorBar as ErrorBarComponent } from 'react-components';
import { CallControls } from './CallControls';
import { useCall, useCallClient, useCallContext, useCallingContext } from '../../providers';
import { CallClientState, StatefulCallClient } from 'calling-stateful-client';
import { AudioOptions, CallState } from '@azure/communication-calling';

export const MINI_HEADER_WINDOW_WIDTH = 450;

export interface CallScreenProps {
  screenWidth: number;
  endCallHandler(): void;
  groupId: string;
}

const spinnerLabel = 'Initializing call client...';

export const CallScreen = (props: CallScreenProps & ErrorHandlingProps): JSX.Element => {
  const { groupId, screenWidth, endCallHandler } = props;

  const ErrorBar = connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);

  const { callAgent } = useCallingContext();
  const { setCall, localVideoStream, isMicrophoneEnabled } = useCallContext();
  const call = useCall();
  const callClient: StatefulCallClient = useCallClient();
  const [callState, setCallState] = useState<CallState | undefined>(undefined);
  const [isScreenSharingOn, setIsScreenSharingOn] = useState<boolean | undefined>(undefined);
  const [joinedCall, setJoinedCall] = useState<boolean>(false);

  // To use useProps to get these states, we need to create another file wrapping Call,
  // It seems unnecessary in this case, so we get the updated states using this approach.
  useEffect(() => {
    const onStateChange = (state: CallClientState): void => {
      call?.id && setCallState(state.calls.get(call.id)?.state);
      console.log(call?.id && state.calls.get(call.id)?.state);
      call?.id && setIsScreenSharingOn(state.calls.get(call.id)?.isScreenSharingOn);
    };

    callClient.onStateChange(onStateChange);

    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [call?.id, callClient]);

  useEffect(() => {
    if (isInCall(callState ?? 'None')) {
      document.title = `${groupId} group call sample`;
    } else {
      if (!isInCall(callState ?? 'None') && callAgent && !joinedCall) {
        const audioOptions: AudioOptions = { muted: !isMicrophoneEnabled };
        const videoOptions = { localVideoStreams: localVideoStream ? [localVideoStream] : undefined };

        const call = callAgent.join(
          {
            groupId
          },
          {
            audioOptions,
            videoOptions
          }
        );
        setCall(call);
        setJoinedCall(true);
      }
    }
  }, [callState, groupId, callAgent, setCall, isMicrophoneEnabled, localVideoStream, joinedCall]);

  return (
    <>
      {isInCall(call?.state ?? 'None') ? (
        <Stack horizontalAlign="center" verticalAlign="center" styles={containerStyles} grow>
          <Stack.Item styles={headerStyles}>
            <Stack className={props.screenWidth > MINI_HEADER_WINDOW_WIDTH ? headerContainer : headerCenteredContainer}>
              <CallControls onEndCallClick={endCallHandler} compressedMode={screenWidth <= MINI_HEADER_WINDOW_WIDTH} />
            </Stack>
            <ErrorBar />
          </Stack.Item>
          <Stack.Item styles={subContainerStyles} grow>
            {!isScreenSharingOn ? (
              callState === 'Connected' && (
                <Stack styles={containerStyles} grow>
                  <Stack.Item grow styles={activeContainerClassName}>
                    <MediaGallery />
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
