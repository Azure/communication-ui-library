// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { CommunicationParticipant, TypingIndicator as TypingIndicatorComponent } from '@azure/communication-react';
import React from 'react';

const TypingIndicatorStory = (args: { typingUsers: CommunicationParticipant[] }): JSX.Element => {
  return <TypingIndicatorComponent typingUsers={args.typingUsers} />;
};

export const TypingIndicator = TypingIndicatorStory.bind({});
