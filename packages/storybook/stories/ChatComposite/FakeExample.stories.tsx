// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapterFromClient,
  createStatefulChatClientWithDeps
} from '@azure/communication-react';
import { FakeChatService } from '@internal/fake-backends';
import { Stack } from '@fluentui/react';
import { Meta } from '@storybook/react/types-6-0';
import React, { useState, useEffect } from 'react';
import { COMPOSITE_FOLDER_PREFIX, compositeExperienceContainerStyle } from '../constants';
import { defaultChatCompositeHiddenControls, controlsToAdd } from '../controlsUtils';
import { getDocs } from './ChatCompositeDocs';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import {
  CommunicationIdentifier,
  CommunicationTokenCredential,
  CommunicationUserIdentifier
} from '@azure/communication-common';
import { compositeLocale } from '../localizationUtils';

const messageArray = [
  'Hello ACS!',
  'Congratulations! You can see this message because you successfully passed in a connection string!',
  'In production environment, it is recommended to issue tokens in server side.',
  'You can also issue a token by creating your own server and input them in required tab below.',
  'Have fun!'
];

const FakeStory = (args, context): JSX.Element => {
  const {
    globals: { locale }
  } = context;

  const [adapter, setAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    (async () => {
      const [userId, chatClient, chatThreadClient] = await setupFakeService(args.displayName);

      const statefulChatClient = createStatefulChatClientWithDeps(chatClient, {
        userId: userId as CommunicationUserIdentifier,
        displayName: args.displayName,
        endpoint: 'FAKE_ENDPIONT',
        credential: fakeToken
      });
      statefulChatClient.startRealtimeNotifications();

      setAdapter(
        await createAzureCommunicationChatAdapterFromClient(
          statefulChatClient,
          await statefulChatClient.getChatThreadClient(chatThreadClient.threadId)
        )
      );
    })();
  }, [args.displayName]);

  if (!adapter) {
    return <>Initializing...</>;
  }

  return (
    <Stack horizontalAlign="center" verticalAlign="center" styles={compositeExperienceContainerStyle}>
      <div style={{ height: '90vh', width: '90vw' }}>
        <ChatComposite
          adapter={adapter}
          fluentTheme={context.theme}
          options={{
            errorBar: args.showErrorBar,
            participantPane: args.showParticipants,
            topic: args.showTopic
          }}
          locale={compositeLocale(locale)}
        />
      </div>
    </Stack>
  );
};

const setupFakeService = async (
  displayName: string
): Promise<[CommunicationIdentifier, ChatClient, ChatThreadClient]> => {
  const fakeChatService = new FakeChatService();
  const [botUserId, botClient] = fakeChatService.newUserAndClient();
  const [localUserId, localClient] = fakeChatService.newUserAndClient();
  const thread = await botClient.createChatThread(
    {
      topic: 'Say Hello'
    },
    {
      participants: [
        { id: botUserId, displayName: 'Friendly bot' },
        { id: localUserId, displayName }
      ]
    }
  );

  sendMessages(botClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID'), messageArray);

  // TODO: Just return a `ChatClient` from the fake.
  return [
    localUserId,
    localClient as ChatClient,
    localClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
  ];
};

const sendMessages = (client: ChatThreadClient, messages: string[]): void => {
  let index = 0;
  // Send first message immediately so users aren't staring at an empty chat thread.
  if (messages.length > 0) {
    client.sendMessage({ content: messages[index++] });
  }
  setInterval(() => {
    if (index < messages.length) {
      client.sendMessage({ content: messages[index++] });
    }
  }, 5000);
};

const fakeToken: CommunicationTokenCredential = {
  getToken(): any {},
  dispose(): any {}
};

export const FakeExample = FakeStory.bind({});

export default {
  id: `${COMPOSITE_FOLDER_PREFIX}-chat-fakeexample`,
  title: `${COMPOSITE_FOLDER_PREFIX}/ChatComposite/Fake Example`,
  component: ChatComposite,
  argTypes: {
    displayName: controlsToAdd.displayName,
    showErrorBar: controlsToAdd.showErrorBar,
    showParticipants: controlsToAdd.showChatParticipants,
    showTopic: controlsToAdd.showChatTopic,
    // Hiding auto-generated controls
    ...defaultChatCompositeHiddenControls
  },
  parameters: {
    useMaxHeightParent: true,
    useMaxWidthParent: true,
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
