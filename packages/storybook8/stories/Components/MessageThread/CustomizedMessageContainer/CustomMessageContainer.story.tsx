// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, MessageThread, MessageThreadStyles } from '@azure/communication-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryWithSystemMessages } from '../snippets/placeholdermessages';

const storyControls = {
  fontStyle: { control: 'radio', options: ['normal', 'italic'], name: 'Font Style' }
};

const CustomMessageContainerStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const messageThreadStyle: MessageThreadStyles = {
    chatMessageContainer: {
      fontStyle: args.fontStyle,
      boxShadow: '0px 3.2px 7.2px rgb(0 0 0 / 13\u0025), 0px 0.6px 1.8px rgb(0 0 0 / 11\u0025)'
    },
    myChatMessageContainer: {
      fontStyle: args.fontStyle,
      boxShadow: '0px 3.2px 7.2px rgb(0 0 0 / 13\u0025), 0px 0.6px 1.8px rgb(0 0 0 / 11\u0025)'
    },
    systemMessageContainer: { fontWeight: 'bold', border: 'double red' }
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} styles={messageThreadStyle} messages={GetHistoryWithSystemMessages()} />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithCustomMessageContainer = CustomMessageContainerStory.bind({});
