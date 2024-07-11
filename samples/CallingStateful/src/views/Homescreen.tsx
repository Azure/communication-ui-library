// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallAgent } from '@azure/communication-calling';
import { CommunicationIdentifier, isPhoneNumberIdentifier, PhoneNumberIdentifier } from '@azure/communication-common';
import { Dialpad } from '@azure/communication-react';
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
        onChange={(_, value) => setTargetParticipants([{ communicationUserId: value || '' }])}
      ></TextField>
      <TextField
        label="Alternate Caller Id"
        placeholder="Enter the alternate caller id"
        onChange={(_, value) => setAlternateCallerId(value || '')}
      ></TextField>
      <Dialpad onChange={(value) => setTargetParticipants([{ phoneNumber: value }])}></Dialpad>
      <PrimaryButton
        onClick={() => {
          if (targetParticipants && targetParticipants.length > 0) {
            if (isPhoneNumberIdentifier(targetParticipants[0]) && alternateCallerId) {
              (callAgent as CallAgent).startCall(targetParticipants as PhoneNumberIdentifier[], {
                alternateCallerId: { phoneNumber: alternateCallerId }
              });
            } else {
              (callAgent as CallAgent).startCall(targetParticipants);
            }
          }
        }}
      >
        Start Call
      </PrimaryButton>
    </Stack>
  );
};
