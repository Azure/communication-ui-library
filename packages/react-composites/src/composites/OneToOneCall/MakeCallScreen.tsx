// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, IconButton, Stack, TextField } from '@fluentui/react';
import { CallIcon, VideoCameraEmphasisIcon } from '@fluentui/react-icons-northstar';
import copy from 'copy-to-clipboard';
import React, { useState } from 'react';
import { useCallContext } from '../../providers';
import { useOutgoingCall } from './hooks/useOutgoingCall';
import useSubscribeToDevicePermission from './hooks/useSubscribeToDevicePermission';
import {
  buttonIconStyle,
  buttonStackTokens,
  buttonStyle,
  inputBoxStyle,
  inputBoxTextStyle,
  mainContainerStyle
} from './styles/MakeCall.styles';

export interface MakeCallScreenProps {
  callerId: string;
  calleeId?: string;
  onStartCall(): void;
}

export const MakeCallScreen = (props: MakeCallScreenProps): JSX.Element => {
  const { callerId, onStartCall } = props;
  const [calleeId, setCalleeId] = useState(props.calleeId ?? '');

  // todo: this should be handled by a mapper of a component
  useSubscribeToDevicePermission('Microphone');
  useSubscribeToDevicePermission('Camera');

  const { makeCall } = useOutgoingCall();
  const { setLocalVideoOn, setIsMicrophoneEnabled } = useCallContext();

  const startCall = (calleeId: string, videoEnabled: boolean): void => {
    if (!videoEnabled) setLocalVideoOn(false);
    else setLocalVideoOn(true);
    setIsMicrophoneEnabled(true);
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
            onStartCall();
            startCall(calleeId, false);
          }}
        >
          <CallIcon className={buttonIconStyle} size="medium" />
          Audio Call
        </DefaultButton>
        <DefaultButton
          disabled={!calleeId}
          className={buttonStyle}
          onClick={() => {
            onStartCall();
            startCall(calleeId, true);
          }}
        >
          <VideoCameraEmphasisIcon className={buttonIconStyle} size="medium" />
          Video Call
        </DefaultButton>
      </Stack>
    </Stack>
  );
};
