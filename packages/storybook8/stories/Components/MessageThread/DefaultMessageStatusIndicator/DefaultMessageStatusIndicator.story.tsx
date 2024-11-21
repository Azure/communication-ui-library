// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';

import { GetHistoryChatMessages } from '../snippets/placeholdermessages';

const storyControls = {
  showMessageStatus: { control: 'boolean', name: 'Show MessageStatus' }
};

const DefaultMessageStatusIndicatorStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} showMessageStatus={args.showMessageStatus} />
    </FluentThemeProvider>
  );
};

export const DefaultMessageStatusIndicator = DefaultMessageStatusIndicatorStory.bind({});
