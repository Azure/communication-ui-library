// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { text } from '@storybook/addon-knobs';
import React, { useRef } from 'react';
import { COMPOSITE_EXPERIENCE_CONTAINER_STYLE } from '../../constants';
import { ContosoChatContainer } from './Container.snippet';
import { ConfigJoinChatThreadHintBanner } from './Utils';

export const JoinExistingChatThread: () => JSX.Element = () => {
  const knobs = useRef({
    endpointUrl: text('Azure Communication Services endpoint URL', '', 'External chat'),
    threadId: text('Existing thread', '', 'External chat'),
    userId: text('User identifier for user', '', 'External chat'),
    token: text('Valid token for user', '', 'External chat'),
    displayName: text('Display name', '', 'External chat')
  });

  const areAllKnobsSet =
    !!knobs.current.endpointUrl &&
    !!knobs.current.threadId &&
    !!knobs.current.userId &&
    !!knobs.current.token &&
    !!knobs.current.displayName;

  return (
    <div style={COMPOSITE_EXPERIENCE_CONTAINER_STYLE}>
      {areAllKnobsSet ? (
        <ContosoChatContainer
          endpointUrl={knobs.current.endpointUrl}
          threadId={knobs.current.threadId}
          userId={{ communicationUserId: knobs.current.userId }}
          token={knobs.current.token}
          displayName={knobs.current.displayName}
          showParticipants={true}
          showTopic={true}
        />
      ) : (
        <ConfigJoinChatThreadHintBanner />
      )}
    </div>
  );
};
