// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Stack } from '@fluentui/react';
import { text } from '@storybook/addon-knobs';
import React, { useRef } from 'react';
import { compositeExperienceContainerStyle } from '../../constants';
import { ContosoCallContainer } from './Container.snippet';
import { ConfigJoinCallHintBanner } from './Utils';

export const JoinExistingCall: () => JSX.Element = () => {
  const knobs = useRef({
    callLocator: text('Call locator (ACS group ID or Teams meeting link)', '', 'External call'),
    userId: text('User identifier for user', '', 'External call'),
    token: text('Valid token for user', '', 'External call'),
    displayName: text('Display name', '', 'External call'),
    callInvitationURL: text('Optional URL to invite other participants to the call', '', 'External call')
  });

  const areAllKnobsSet =
    !!knobs.current.callLocator && !!knobs.current.userId && !!knobs.current.token && !!knobs.current.displayName;
  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      {areAllKnobsSet ? (
        <ContosoCallContainer
          locator={knobs.current.callLocator}
          userId={{ communicationUserId: knobs.current.userId }}
          token={knobs.current.token}
          displayName={knobs.current.displayName}
          callInvitationURL={knobs.current.callInvitationURL}
        />
      ) : (
        <ConfigJoinCallHintBanner />
      )}
    </Stack>
  );
};
