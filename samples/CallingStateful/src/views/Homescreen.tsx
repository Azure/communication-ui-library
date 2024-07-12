// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAgent } from '@azure/communication-calling';
import {
  CommunicationIdentifier,
  CommunicationUserIdentifier,
  isMicrosoftTeamsAppIdentifier,
  isMicrosoftTeamsUserIdentifier,
  isPhoneNumberIdentifier,
  MicrosoftTeamsUserIdentifier,
  PhoneNumberIdentifier
} from '@azure/communication-common';
import { Dialpad, fromFlatCommunicationIdentifier } from '@azure/communication-react';
import { PrimaryButton, Stack, TextField } from '@fluentui/react';
import React, { useState } from 'react';

export interface HomeScreenProps {
  callAgent: CallAgent;
}

export const HomeScreen = (props: HomeScreenProps): JSX.Element => {
  const { callAgent } = props;
  const [targetParticipants, setTargetParticipants] = useState<CommunicationIdentifier[]>();
  const [alternateCallerId, setAlternateCallerId] = useState<string>();
  return (
    <Stack tokens={{ childrenGap: '1rem' }} style={{ width: '20rem' }}>
      <TextField
        label="ACS or Teams user ID"
        placeholder="Enter the userId you want to call"
        onChange={(_, value: string) => {
          const ids: string[] = value.split(',');
          let newParticipants: CommunicationIdentifier[] = [];
          ids.forEach((id) => {
            const identifier = fromFlatCommunicationIdentifier(id);
            if (isMicrosoftTeamsUserIdentifier(identifier)) {
              newParticipants = newParticipants.concat([{ microsoftTeamsUserId: id || '' }]);
            } else if (isMicrosoftTeamsAppIdentifier(identifier)) {
              newParticipants = newParticipants.concat([{ teamsAppId: id || '' }]);
            } else {
              newParticipants = newParticipants.concat([{ communicationUserId: id || '' }]);
            }
          });
          setTargetParticipants(newParticipants);
        }}
      ></TextField>
      <TextField
        label="Alternate Caller Id"
        placeholder="Enter the alternate caller id"
        onChange={(_, value: string) => setAlternateCallerId(value || '')}
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
  );
};
