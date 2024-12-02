// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { ArgsFrom, controlsToAdd } from '../../../controlsUtils';
import { GetHistoryChatMessages } from './../snippets/placeholdermessages';

const storyControls = {
  showMessageDate: controlsToAdd.showMessageDate
};

const MessageThreadWithMessageDateStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} showMessageDate={args.showMessageDate} messages={GetHistoryChatMessages()} />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithMessageDate = MessageThreadWithMessageDateStory.bind({});
