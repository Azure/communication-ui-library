// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-signaling';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { _IdentifierProvider } from '@internal/react-components';
import { nanoid } from 'nanoid';
import React, { useEffect, useState } from 'react';
import {
  ChatAdapter,
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR,
  createAzureCommunicationChatAdapterFromClient,
  FileDownloadError,
  FileDownloadHandler
} from '../../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../common/constants';
import { verifyParamExists } from '../../common/testAppUtils';
import { FakeChatAdapterArgs, FileUpload } from '../fake-adapter/FakeChatAdapterArgs';
import { FakeChatClient } from './fake-back-end/FakeChatClient';
import { Model } from './fake-back-end/Model';
import { IChatClient } from './fake-back-end/types';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

/**
 * App with chat composite using a fake Chat adapter
 */
export const FakeAdapterApp = (): JSX.Element => {
  // Required params
  const fakeChatAdapterArgs = JSON.parse(
    verifyParamExists(params.fakeChatAdapterArgs, 'fakeChatAdapterArgs')
  ) as FakeChatAdapterArgs;

  const [adapter, setAdapter] = useState<ChatAdapter | undefined>(undefined);
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const chatClientModel = new Model({ asyncDelivery: false });
      const localUser = { id: { communicationUserId: nanoid() }, displayName: fakeChatAdapterArgs.localParticipant };
      const remoteParticipants: ChatParticipant[] = fakeChatAdapterArgs.remoteParticipants.map((user) => {
        return {
          id: { communicationUserId: nanoid() },
          displayName: user
        };
      });
      const participants = orderParticipants(
        localUser,
        remoteParticipants,
        fakeChatAdapterArgs.localParticipantPosition
      );
      const chatClient = new FakeChatClient(chatClientModel, localUser.id);
      const thread = await chatClient.createChatThread(
        {
          topic: 'Cowabunga'
        },
        {
          participants
        }
      );
      const adapterInfo = {
        userId: localUser.id,
        displayName: localUser.displayName,
        chatClient: chatClient as IChatClient as ChatClient,
        chatThreadClient: chatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
      };
      const adapter = await initializeAdapter(adapterInfo);
      setAdapter(adapter);
      if (fakeChatAdapterArgs.fileUploads) {
        handleFileUploads(adapter, fakeChatAdapterArgs.fileUploads);
      }
      if (fakeChatAdapterArgs.sendRemoteFileSharingMessage && thread.chatThread && remoteParticipants.length > 0) {
        sendRemoteFileSharingMessage(chatClientModel, remoteParticipants[0], thread);
      }
    };

    initialize();
    return () => adapter && adapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fileDownloadHandler: FileDownloadHandler = (fileData): Promise<URL | FileDownloadError> => {
    return new Promise((resolve) => {
      if (fakeChatAdapterArgs.failFileDownload) {
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
            locale={fakeChatAdapterArgs.frenchLocalEnabled ? COMPOSITE_LOCALE_FR_FR : undefined}
            options={{
              participantPane: true,
              fileSharing: fakeChatAdapterArgs.fileSharingEnabled
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
};

const initializeAdapter = async (adapterInfo: AdapterInfo): Promise<ChatAdapter> => {
  const statefulChatClient = _createStatefulChatClientWithDeps(adapterInfo.chatClient, {
    userId: adapterInfo.userId as CommunicationUserIdentifier,
    displayName: adapterInfo.displayName,
    endpoint: 'FAKE_ENDPIONT',
    credential: fakeToken
  });
  statefulChatClient.startRealtimeNotifications();
  return await createAzureCommunicationChatAdapterFromClient(
    statefulChatClient,
    await statefulChatClient.getChatThreadClient(adapterInfo.chatThreadClient.threadId)
  );
};

interface AdapterInfo {
  userId: CommunicationIdentifier;
  displayName: string;
  chatClient: ChatClient;
  chatThreadClient: ChatThreadClient;
}

const fakeToken: CommunicationTokenCredential = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
  getToken(): any {},
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-empty-function
  dispose(): any {}
};

const orderParticipants = (
  localUser: ChatParticipant,
  remoteParticipants: ChatParticipant[],
  localPosition?: number
): ChatParticipant[] => {
  const participants = remoteParticipants;
  const splicePosition = localPosition && localPosition < participants.length ? localPosition : 0;
  participants.splice(splicePosition, 0, localUser);
  return participants;
};

const handleFileUploads = (adapter: ChatAdapter, fileUploads: FileUpload[]): void => {
  fileUploads.forEach((file) => {
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
};

const sendRemoteFileSharingMessage = (chatClientModel: Model, remoteParticipant: ChatParticipant, thread): void => {
  const chatClient = new FakeChatClient(chatClientModel, remoteParticipant.id);
  chatClient.getChatThreadClient(thread.chatThread.id).sendMessage(
    { content: 'Hello!' },
    {
      senderDisplayName: remoteParticipant.displayName,
      type: 'text',
      metadata: {
        fileSharingMetadata: JSON.stringify([{ name: 'SampleFile1.pdf', extension: 'pdf' }])
      }
    }
  );
};
