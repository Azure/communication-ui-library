// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatParticipant, ChatThreadClient } from '@azure/communication-chat';
import { CommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { CommunicationIdentifier } from '@azure/communication-signaling';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { _IdentifierProvider } from '@internal/react-components';
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
import {
  customOnFetchAvatarPersonaData,
  customOnRenderMessage,
  customOnRenderTypingIndicator
} from './CustomDataModel';
import { FakeChatClient } from '@internal/fake-backends';
import { Model } from '@internal/fake-backends';
import { IChatClient } from '@internal/fake-backends';
import { ChatThreadRestError, FakeChatAdapterArgs, FileUpload } from './FakeChatAdapterArgs';
import { RestError } from '@azure/core-http';

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

  const [adapter, setAdapter] = useState<ChatAdapter>();
  const [remoteAdapters, setRemoteAdapters] = useState<ChatAdapter[]>([]);
  useEffect(() => {
    const initialize = async (): Promise<void> => {
      const chatClientModel = new Model({ asyncDelivery: false });
      const participants = orderParticipants(
        fakeChatAdapterArgs.localParticipant,
        fakeChatAdapterArgs.remoteParticipants,
        fakeChatAdapterArgs.localParticipantPosition
      );
      const chatClient = new FakeChatClient(chatClientModel, fakeChatAdapterArgs.localParticipant.id);
      const thread = await chatClient.createChatThread({ topic: 'Cowabunga' }, { participants });
      const chatThreadClient = chatClient.getChatThreadClient(thread?.chatThread?.id ?? 'INVALID_THREAD_ID');
      const adapter = await initializeAdapter(
        {
          userId: fakeChatAdapterArgs.localParticipant.id,
          displayName: fakeChatAdapterArgs.localParticipant.displayName,
          chatClient: chatClient as IChatClient as ChatClient,
          chatThreadClient: chatThreadClient
        },
        fakeChatAdapterArgs.chatThreadClientMethodErrors
      );
      setAdapter(adapter);
      if (fakeChatAdapterArgs.participantsWithHiddenComposites) {
        const remoteAdapters = await initializeAdapters(
          fakeChatAdapterArgs.participantsWithHiddenComposites,
          chatClientModel,
          thread
        );
        setRemoteAdapters(remoteAdapters);
      }
      if (fakeChatAdapterArgs.fileUploads) {
        handleFileUploads(adapter, fakeChatAdapterArgs.fileUploads);
      }
      if (
        fakeChatAdapterArgs.sendRemoteFileSharingMessage &&
        thread.chatThread &&
        fakeChatAdapterArgs.remoteParticipants.length > 0
      ) {
        sendRemoteFileSharingMessage(chatClientModel, fakeChatAdapterArgs.remoteParticipants[0], thread);
      }
    };

    initialize();
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

  if (!adapter) {
    return <>{'Initializing chat adapter...'}</>;
  }

  return (
    <>
      {adapter && (
        <_IdentifierProvider identifiers={IDS}>
          <ChatComposite
            adapter={adapter}
            locale={fakeChatAdapterArgs.frenchLocaleEnabled ? COMPOSITE_LOCALE_FR_FR : undefined}
            onRenderTypingIndicator={
              fakeChatAdapterArgs.customDataModelEnabled ? customOnRenderTypingIndicator : undefined
            }
            onRenderMessage={fakeChatAdapterArgs.customDataModelEnabled ? customOnRenderMessage : undefined}
            options={{
              participantPane: fakeChatAdapterArgs.showParticipantPane ?? false,
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
            onFetchAvatarPersonaData={
              fakeChatAdapterArgs.customDataModelEnabled ? customOnFetchAvatarPersonaData : undefined
            }
          />
        </_IdentifierProvider>
      )}
      {remoteAdapters && createHiddenComposites(remoteAdapters)}
    </>
  );
};

const initializeAdapter = async (
  adapterInfo: AdapterInfo,
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, ChatThreadRestError>>
): Promise<ChatAdapter> => {
  const statefulChatClient = _createStatefulChatClientWithDeps(adapterInfo.chatClient, {
    userId: adapterInfo.userId as CommunicationUserIdentifier,
    displayName: adapterInfo.displayName,
    endpoint: 'FAKE_ENDPOINT',
    credential: fakeToken
  });
  statefulChatClient.startRealtimeNotifications();
  const chatThreadClient: ChatThreadClient = await statefulChatClient.getChatThreadClient(
    adapterInfo.chatThreadClient.threadId
  );
  registerchatThreadClientMethodErrors(chatThreadClient, chatThreadClientMethodErrors);
  return await createAzureCommunicationChatAdapterFromClient(statefulChatClient, chatThreadClient);
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

const initializeAdapters = async (
  participants: ChatParticipant[],
  chatClientModel: Model,
  thread
): Promise<ChatAdapter[]> => {
  const remoteAdapters = [];
  for (const participant of participants) {
    const remoteChatClient = new FakeChatClient(chatClientModel, participant.id);
    const remoteAdapter = await initializeAdapter({
      userId: participant.id,
      displayName: participant.displayName,
      chatClient: remoteChatClient as IChatClient as ChatClient,
      chatThreadClient: remoteChatClient.getChatThreadClient(thread.chatThread?.id ?? 'INVALID_THREAD_ID')
    });
    remoteAdapters.push(remoteAdapter);
  }
  return remoteAdapters;
};

const createHiddenComposites = (remoteAdapters: ChatAdapter[]): JSX.Element[] => {
  return remoteAdapters.map((remoteAdapter) => {
    const userId = toFlatCommunicationIdentifier(remoteAdapter.getState().userId);
    const compositeID = `hidden-composite-${userId}`;
    return (
      <div id={compositeID} key={compositeID} style={{ height: 0, overflow: 'hidden' }}>
        <ChatComposite adapter={remoteAdapter} options={{ participantPane: true }} />
      </div>
    );
  });
};

const registerchatThreadClientMethodErrors = (
  chatThreadClient: ChatThreadClient,
  chatThreadClientMethodErrors?: Partial<Record<keyof ChatThreadClient, ChatThreadRestError>>
): void => {
  for (const k in chatThreadClientMethodErrors) {
    chatThreadClient[k] = () => {
      throw new RestError(
        chatThreadClientMethodErrors[k].message ?? '',
        chatThreadClientMethodErrors[k].code,
        chatThreadClientMethodErrors[k].statusCode
      );
    };
  }
};
