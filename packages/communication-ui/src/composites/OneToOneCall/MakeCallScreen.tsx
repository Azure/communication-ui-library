// © Microsoft Corporation. All rights reserved.

import { IconButton, DefaultButton, Stack, TextField } from '@fluentui/react';
import React, { useState } from 'react';

import { CallIcon, VideoCameraEmphasisIcon } from '@fluentui/react-icons-northstar';
import {
  buttonIconStyle,
  buttonStackTokens,
  buttonStyle,
  inputBoxStyle,
  inputBoxTextStyle,
  mainContainerStyle
} from './styles/MakeCall.styles';
import { useLocalVideo, useMicrophone, useOutgoingCall, useSubscribeToDevicePermission } from '../../hooks';
import copy from 'copy-to-clipboard';
import { useCallingContext } from '../../providers';

export interface MakeCallScreenProps {
  callerId: string;
  calleeId?: string;
  startAudioCallHandler(callId: string): void;
  startVideoCallHandler(callId: string): void;
}

const audioCallButtonText = 'Audio call';
const videoCallButtonText = 'Video call';

export const MakeCallScreen = (props: MakeCallScreenProps): JSX.Element => {
  const { callerId, startAudioCallHandler, startVideoCallHandler } = props;
  const [calleeId, setCalleeId] = useState(props.calleeId ?? '');

  // todo: this should be handled by a mapper of a component
  useSubscribeToDevicePermission('Microphone');
  useSubscribeToDevicePermission('Camera');
  const { unmute } = useMicrophone();
  const { startLocalVideo } = useLocalVideo();
  const { videoDeviceInfo } = useCallingContext();
  const { makeCall } = useOutgoingCall();

  const startCall: (calleeId: string, videoEnabled: boolean) => Promise<void> = async (
    calleeId: string,
    videoEnabled: boolean
  ) => {
    if (videoEnabled && videoDeviceInfo) {
      await startLocalVideo(videoDeviceInfo);
    }
    await unmute();
    makeCall({ communicationUserId: calleeId });
  };

  return (
    <Stack className={mainContainerStyle} horizontalAlign="center" verticalAlign="center">
      <Stack horizontal horizontalAlign="center" verticalAlign="center">
        <TextField
          autoComplete="off"
          ariaLabel="Enter callee id"
          borderless={true}
          onChange={(event: any) => setCalleeId(event.target.value)}
          id="name"
          placeholder="Enter callee id"
          inputClassName={inputBoxTextStyle}
          className={inputBoxStyle}
        />
        <IconButton
          style={{ marginLeft: '0.2rem' }}
          onClick={() => {
            copy(callerId);
          }}
          iconProps={{ iconName: 'Copy' }}
          title="Copy my callerID"
        />
      </Stack>
      <Stack horizontal tokens={buttonStackTokens}>
        <DefaultButton
          disabled={!calleeId}
          className={buttonStyle}
          onClick={() => {
            startAudioCallHandler(calleeId);
            startCall(calleeId, false);
          }}
        >
          <CallIcon className={buttonIconStyle} size="medium" />
          {audioCallButtonText}
        </DefaultButton>
        <DefaultButton
          disabled={!calleeId}
          className={buttonStyle}
          onClick={() => {
            startVideoCallHandler(calleeId);
            startCall(calleeId, true);
          }}
        >
          <VideoCameraEmphasisIcon className={buttonIconStyle} size="medium" />
          {videoCallButtonText}
        </DefaultButton>
      </Stack>
    </Stack>
  );
};
