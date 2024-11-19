// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryChatMessages } from '../snippets/placeholdermessages';

const storyControls = {
  backgroundColor: { control: 'text', name: 'Background Color' },
  padding: { control: 'text', name: 'Padding (px)' }
};

const CustomizedChatContainerStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const messageThreadStyles = {
    chatContainer: {
      backgroundColor: args.backgroundColor,
      padding: args.padding + 'px'
    }
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} styles={messageThreadStyles} />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithCustomizedChatContainer = CustomizedChatContainerStory.bind({});
