// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessage, FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';

const storyControls = {
  mentionNames: { control: 'text', name: 'Mention Names (comma seperated list)' }
};

const MentionUsersStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  const user1Id = 'user1';
  const user2Id = 'user2';
  const user3Id = 'user3';

  const names = args.mentionNames.split(',').map((name: string) => name.trim());
  const mentionlist = [
    {
      id: 'everyone',
      displayText: 'Everyone'
    }
  ];

  names.forEach((name: string) => {
    mentionlist.push({
      id: name,
      displayText: name
    });
  });

  const messages: ChatMessage[] = [
    {
      messageType: 'chat',
      senderId: user1Id,
      senderDisplayName: 'Kat Larsson',
      messageId: Math.random().toString(),
      content: `Hey <msft-mention id="${user2Id}">Robert Tolbert</msft-mention> and <msft-mention id="${user3Id}">Milton Dyer</msft-mention>, can you help me with my internet connection?`,
      createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
      mine: false,
      attached: false,
      status: 'seen' as MessageStatus,
      contentType: 'html'
    },
    {
      messageType: 'chat',
      senderId: user2Id,
      senderDisplayName: 'Robert Tolbert',
      messageId: Math.random().toString(),
      content: 'Absolutely! What seems to be the problem? <msft-mention id="${user1Id}">Kat Larsson</msft-mention>',
      createdOn: new Date('2019-04-13T00:00:00.000+08:11'),
      mine: true,
      attached: false,
      contentType: 'html'
    }
  ];

  const onUpdateMessageCallback = (messageId: string, content: string): Promise<void> => {
    const msgIdx = messages.findIndex((m) => m.messageId === messageId);
    const message = messages[msgIdx] as ChatMessage;
    message.content = content;
    message.editedOn = new Date(Date.now());
    messages[msgIdx] = message;

    return Promise.resolve();
  };

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={user2Id}
        showMessageDate={true}
        messages={messages}
        onUpdateMessage={onUpdateMessageCallback}
        mentionOptions={{
          displayOptions: {
            onRenderMention: (mention, defaultOnMentionRender) => {
              return <button key={Math.random().toString()}>{defaultOnMentionRender(mention)}</button>;
            }
          },
          lookupOptions: {
            onQueryUpdated: async (query) => {
              return Promise.resolve(
                mentionlist.filter((suggestion) =>
                  suggestion.displayText.toLocaleLowerCase().startsWith(query.toLocaleLowerCase())
                )
              );
            }
          }
        }}
      />
    </FluentThemeProvider>
  );
};

export const MessageThreadWithMentionUsers = MentionUsersStory.bind({});
