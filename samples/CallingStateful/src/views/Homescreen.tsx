// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAgent, LocalVideoStream } from '@azure/communication-calling';
import {
  CommunicationIdentifier,
  CommunicationUserIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier,
  MicrosoftTeamsUserIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
import { Dialpad, fromFlatCommunicationIdentifier } from '@azure/communication-react';

import { IncomingCallStack, usePropsFor } from '@azure/communication-react';
import { PrimaryButton, Stack, TextField, Image } from '@fluentui/react';
import React, { useState } from 'react';
import { imgStyle } from '../styles/HomeScreen.styles';

export interface HomeScreenProps {
  callAgent: CallAgent;
  headerImageProps?: {
    src?: string;
  };
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const { callAgent, headerImageProps } = props;
  const [targetParticipants, setTargetParticipants] = useState<CommunicationIdentifier[]>();
  const [alternateCallerId, setAlternateCallerId] = useState<string>();

  const createVideoMediaStreamToSend = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1500;
    canvas.height = 845;
    if (ctx) {
      ctx.fillStyle = 'blue';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const colors = ['red', 'yellow'];
      window.setInterval(() => {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] || 'black';
        const x = Math.floor(Math.random() * canvas.width);
        const y = Math.floor(Math.random() * canvas.height);
        const size = 100;
        ctx.fillRect(x, y, size, size);
      }, 1000 / 30);
    }

    return canvas.captureStream(30);
  };

  const mediaStream = createVideoMediaStreamToSend();
  const localStream = new LocalVideoStream(mediaStream);

  const incomingCallStackProps = usePropsFor(IncomingCallStack);
  return (
    <Stack horizontal tokens={{ childrenGap: '1rem' }}>
      <Stack style={{ position: 'absolute', top: '0', right: '0' }}>
        {<IncomingCallStack {...incomingCallStackProps} tabIndex={1} />}
      </Stack>
      <Stack verticalAlign="center">
        <Image alt="Welcome to the ACS Calling sample app" className={imgStyle} {...headerImageProps} />
      </Stack>
      <Stack tokens={{ childrenGap: '1rem' }} style={{ minWidth: '20rem', margin: 'auto' }}>
        <TextField
          label="ACS or Teams user ID"
          placeholder="Enter the userId you want to call"
          onChange={(_, value: string | undefined) => {
            const ids: string[] = value ? value.split(',') : [];
            let newParticipants: CommunicationIdentifier[] = [];
            ids.forEach((id) => {
              newParticipants = newParticipants.concat([fromFlatCommunicationIdentifier(id)]);
            });
            setTargetParticipants(newParticipants);
          }}
        ></TextField>
        <TextField
          label="Alternate Caller Id"
          placeholder="Enter the alternate caller id"
          onChange={(_, value: string | undefined) => setAlternateCallerId(value || '')}
        ></TextField>
        <Dialpad onChange={(value) => setTargetParticipants([{ phoneNumber: value }])}></Dialpad>
        <PrimaryButton
          onClick={() => {
            console.log('targetParticipants', targetParticipants);
            if (targetParticipants && targetParticipants[0]) {
              if (isPhoneNumberIdentifier(targetParticipants[0]) && alternateCallerId) {
                (callAgent as CallAgent).startCall(targetParticipants as PhoneNumberIdentifier[], {
                  alternateCallerId: { phoneNumber: alternateCallerId }
                });
              } else {
                if (isMicrosoftTeamsUserIdentifier(targetParticipants[0])) {
                  (callAgent as CallAgent).startCall(targetParticipants as MicrosoftTeamsUserIdentifier[]);
                } else {
                  (callAgent as CallAgent).startCall(targetParticipants as CommunicationUserIdentifier[], {
                    videoOptions: { localVideoStreams: [localStream] }
                  });
                }
              }
            }
          }}
        >
          Start Call
        </PrimaryButton>
      </Stack>
    </Stack>
  );
};
