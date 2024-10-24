// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAgent } from '@azure/communication-calling';
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
            if (targetParticipants && targetParticipants.length > 0) {
              if (isPhoneNumberIdentifier(targetParticipants[0]) && alternateCallerId) {
                (callAgent as CallAgent).startCall(targetParticipants as PhoneNumberIdentifier[], {
                  alternateCallerId: { phoneNumber: alternateCallerId }
                });
              } else {
                if (isMicrosoftTeamsUserIdentifier(targetParticipants[0])) {
                  (callAgent as CallAgent).startCall(targetParticipants as MicrosoftTeamsUserIdentifier[]);
                } else {
                  (callAgent as CallAgent).startCall(targetParticipants as CommunicationUserIdentifier[]);
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
