// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  AzureCommunicationTokenCredential,
  CommunicationTokenCredential,
  CommunicationUserIdentifier
} from '@azure/communication-common';
import { Stack } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { MessageProps, _IdentifierProvider } from '@internal/react-components';
import { createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  ChatAdapter,
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR,
  FileDownloadError,
  FileDownloadHandler,
  useAzureCommunicationChatAdapter,
  createAzureCommunicationChatAdapterFromClient
} from '../../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../common/constants';
import { initializeIconsForUITests, verifyParamExists } from '../../common/testAppUtils';
// import { InMemoryChatClient } from './mock/InMemoryTestChatClient';
// import { TestChatAdapter } from './mock/TestChatAdapter';
import { FakeChatService } from './fake/ChatService';
import { CommunicationIdentifier } from '@azure/communication-signaling';
import { ChatClient, ChatThreadClient } from '@azure/communication-chat';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Required params
const displayName = verifyParamExists(params.displayName, 'displayName');
const token = verifyParamExists(params.token, 'token');
const endpoint = verifyParamExists(params.endpointUrl, 'endpointUrl');
const threadId = verifyParamExists(params.threadId, 'threadId');
const userId = verifyParamExists(params.userId, 'userId');

// Optional params
const useFrLocale = Boolean(params.useFrLocale);
const customDataModel = params.customDataModel;
const useFileSharing = Boolean(params.useFileSharing);
const failFileDownload = Boolean(params.failDownload);
const uploadedFiles = params.uploadedFiles ? JSON.parse(params.uploadedFiles) : [];

// Needed to initialize default icons used by Fluent components.
initializeFileTypeIcons();
initializeIconsForUITests();

let fakeChat = undefined;
try {
  fakeChat = JSON.parse(params.fakeChat);
} catch (e) {
  console.log('Query parameter fakeChat could not be parsed: ', params.fakeChat);
}

function App(): JSX.Element {
  const args = useMemo(
    () => ({
      endpoint,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      credential: new AzureCommunicationTokenCredential(token),
      threadId
    }),
    []
  );
  const adapter: ChatAdapter = fakeChat
    ? createFakeChatAdapter()
    : useAzureCommunicationChatAdapter(args, async (adapter) => {
        // fetch initial data before we render the component to avoid flaky test (time gap between header and participant list)
        await adapter.fetchInitialData();
        return adapter;
      });

  React.useEffect(() => {
    if (adapter && uploadedFiles.length) {
      uploadedFiles.forEach((file) => {
        if (file.uploadComplete) {
          const fileUploads = adapter.registerActiveFileUploads([new File([], file.name)]);
          fileUploads[0].notifyUploadCompleted({
            name: file.name,
            extension: file.extension,
            url: file.url
          });
        } else if (file.error) {
          const fileUploads = adapter.registerActiveFileUploads([new File([], file.name)]);
          fileUploads[0].notifyUploadFailed(file.error);
        } else if (file.progress) {
          const fileUploads = adapter.registerActiveFileUploads([new File([], file.name)]);
          fileUploads[0].notifyUploadProgressChanged(file.progress);
        } else {
          adapter.registerCompletedFileUploads([file]);
        }
      });
    }
  }, [adapter]);

  const fileDownloadHandler: FileDownloadHandler = (userId, fileData): Promise<URL | FileDownloadError> => {
    return new Promise((resolve) => {
      if (failFileDownload) {
        resolve({ errorMessage: 'You don’t have permission to download this file.' });
      } else {
        resolve(new URL(fileData.url));
      }
    });
  };

  return (
    <>
      {!adapter && 'Initializing chat adapter...'}
      {adapter && (
        <_IdentifierProvider identifiers={IDS}>
          <ChatComposite
            adapter={adapter}
            onRenderTypingIndicator={
              customDataModel
                ? (typingUsers) => (
                    <Stack style={{ width: '100%' }}>
                      <text id="custom-data-model-typing-indicator">
                        {typingUsers.length > 0
                          ? `${typingUsers.map((user) => user.displayName).join(',')} is typing...`.toUpperCase()
                          : 'No one is currently typing.'}
                      </text>
                    </Stack>
                  )
                : undefined
            }
            onRenderMessage={
              customDataModel
                ? (messageProps) => (
                    <text
                      data-ui-status={messageProps.message.messageType === 'chat' ? messageProps.message.status : ''}
                      id="custom-data-model-message"
                    >
                      {getMessageContentInUppercase(messageProps)}
                    </text>
                  )
                : undefined
            }
            onFetchAvatarPersonaData={
              customDataModel
                ? () =>
                    new Promise((resolve) =>
                      resolve({
                        imageInitials: 'CI',
                        text: 'Custom Name'
                      })
                    )
                : undefined
            }
            locale={useFrLocale ? COMPOSITE_LOCALE_FR_FR : undefined}
            options={{
              participantPane: true,
              fileSharing: useFileSharing
                ? {
                    downloadHandler: fileDownloadHandler,
                    uploadHandler: () => {
                      //noop
                    },
                    multiple: true
                  }
                : undefined
            }}
          />
        </_IdentifierProvider>
      )}
    </>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

function getMessageContentInUppercase(messageProps: MessageProps): string {
  const message = messageProps.message;
  switch (message.messageType) {
    case 'chat':
    case 'custom':
      return message.content.toUpperCase();
    case 'system':
      switch (message.systemMessageType) {
        case 'content':
          return message.content.toUpperCase();
        case 'topicUpdated':
          return message.topic.toUpperCase();
        case 'participantAdded':
          return `Participants Added: ${message.participants.map((p) => p.displayName).join(',')}`.toUpperCase();
        case 'participantRemoved':
          return `Participants Removed: ${message.participants.map((p) => p.displayName).join(',')}`.toUpperCase();
        default:
          return 'CUSTOM MESSAGE';
      }
    default:
      'CUSTOM MESSAGE';
  }
}

function createFakeChatAdapter(): ChatAdapter {
  // return new TestChatAdapter(
  //   { id: '1', displayName: 'user1' },
  //   new InMemoryChatClient({
  //     chatMessages: {
  //       '1': {
  //         id: '1',
  //         type: 'text',
  //         version: '1',
  //         sequenceId: '1',
  //         createdOn: new Date(),
  //         status: 'delivered',
  //         content: { message: 'test' }
  //       }
  //     }
  //   })
  // );
  const chatService = new FakeChatService();
  const [firstUserId, firstChatClient] = chatService.newUserAndClient();
  const g = {
    userId: firstUserId,
    displayName: '1',
    chatClient: firstChatClient,
    chatThreadClient: firstChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
  };
}

export const setupFakeThreadWithTwoParticipants = async (
  firstDisplayName: string,
  secondDisplayName: string
): Promise<[ParticipantHandle, ParticipantHandle]> => {
  const fakeChatService = new FakeChatService({
    asyncDelivery: true,
    maxDelayMilliseconds: 3000
  });
  const [firstUserId, firstChatClient] = fakeChatService.newUserAndClient();
  const [secondUserId, secondChatClient] = fakeChatService.newUserAndClient();
  const thread = await firstChatClient.createChatThread(
    {
      topic: 'Say Hello'
    },
    {
      participants: [
        { id: firstUserId, displayName: firstDisplayName },
        { id: secondUserId, displayName: secondDisplayName }
      ]
    }
  );

  return [
    {
      userId: firstUserId,
      displayName: firstDisplayName,
      chatClient: firstChatClient,
      chatThreadClient: firstChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
    },
    {
      userId: secondUserId,
      displayName: secondDisplayName,
      chatClient: secondChatClient,
      chatThreadClient: secondChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
    }
  ];
};

export const initializeAdapter = async (participant: ParticipantHandle): Promise<ChatAdapter> => {
  const statefulChatClient = createStatefulChatClientWithDeps(participant.chatClient, {
    userId: participant.userId as CommunicationUserIdentifier,
    displayName: participant.displayName,
    endpoint: 'FAKE_ENDPIONT',
    credential: fakeToken
  });
  statefulChatClient.startRealtimeNotifications();
  return await createAzureCommunicationChatAdapterFromClient(
    statefulChatClient,
    await statefulChatClient.getChatThreadClient(participant.chatThreadClient.threadId)
  );
};

export interface ParticipantHandle {
  userId: CommunicationIdentifier;
  displayName: string;
  chatClient: ChatClient;
  chatThreadClient: ChatThreadClient;
}

const fakeToken: CommunicationTokenCredential = {
  getToken(): any {},
  dispose(): any {}
};
