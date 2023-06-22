// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant, ChatMessage } from '@azure/communication-chat';
import { getIdentifierKind } from '@azure/communication-common';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { _IdentifierProvider, FileDownloadError, FileDownloadHandler } from '@internal/react-components';
import React, { useEffect } from 'react';
import {
  ChatAdapter,
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR,
  _FakeChatAdapterArgs,
  _useFakeChatAdapters,
  _MockFileUpload
} from '../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../browser/common/constants';
import {
  customOnFetchAvatarPersonaData,
  customOnRenderMessage,
  customOnRenderTypingIndicator
} from './CustomDataModel';
import { FakeChatClient, Model, Thread } from '@internal/fake-backends';
import { HiddenChatComposites } from '../lib/HiddenChatComposites';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const fakeChatAdapterArgs = params.fakeChatAdapterArgs
  ? (JSON.parse(params.fakeChatAdapterArgs) as _FakeChatAdapterArgs)
  : undefined;

/**
 * App with chat composite using a fake Chat adapter
 */
export const FakeAdapterApp = (): JSX.Element => {
  if (!fakeChatAdapterArgs) {
    throw new Error('fakeChatAdapterArgs not set');
  }

  const fakeAdapters = _useFakeChatAdapters(fakeChatAdapterArgs);

  useEffect(() => {
    (async (): Promise<void> => {
      if (!fakeAdapters) {
        return;
      }

      if (fakeChatAdapterArgs.fileUploads) {
        handleFileUploads(fakeAdapters.local, fakeChatAdapterArgs.fileUploads);
      }

      if (fakeChatAdapterArgs.sendRemoteFileSharingMessage && fakeChatAdapterArgs.remoteParticipants.length > 0) {
        sendRemoteFileSharingMessage(
          fakeAdapters.service.model,
          fakeChatAdapterArgs.remoteParticipants[0],
          fakeAdapters.service.threadId
        );
      }

      if (fakeChatAdapterArgs.sendRemoteInlineImageMessage && fakeChatAdapterArgs.remoteParticipants.length > 0) {
        sendRemoteInlineImageMessage(
          fakeAdapters.service.model,
          fakeChatAdapterArgs.localParticipant,
          fakeChatAdapterArgs.remoteParticipants[0],
          fakeAdapters.service.threadId
        );
      }
    })();
  }, [fakeAdapters]);

  const fileDownloadHandler: FileDownloadHandler = (_userId, fileData): Promise<URL | FileDownloadError> => {
    return new Promise((resolve) => {
      if (fakeChatAdapterArgs.failFileDownload) {
        resolve({ errorMessage: 'You don’t have permission to download this file.' });
      } else {
        resolve(new URL(fileData.url));
      }
    });
  };

  if (!fakeAdapters) {
    return <>{'Initializing chat adapter...'}</>;
  }

  return (
    <>
      {fakeAdapters && (
        <_IdentifierProvider identifiers={IDS}>
          <ChatComposite
            adapter={fakeAdapters.local}
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
      <HiddenChatComposites adapters={fakeAdapters.remotes} />
    </>
  );
};

const handleFileUploads = (adapter: ChatAdapter, fileUploads: _MockFileUpload[]): void => {
  fileUploads.forEach((file) => {
    if (file.uploadComplete) {
      const fileUploads = adapter.registerActiveFileUploads([new File([], file.name)]);
      fileUploads[0].notifyUploadCompleted({
        name: file.name,
        extension: file.extension,
        url: file.url,
        attachmentType: 'fileSharing',
        id: ''
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

const sendRemoteFileSharingMessage = (
  chatClientModel: Model,
  remoteParticipant: ChatParticipant,
  threadId: string
): void => {
  const chatClient = new FakeChatClient(chatClientModel, remoteParticipant.id);
  chatClient.getChatThreadClient(threadId).sendMessage(
    { content: 'Hello!' },
    {
      senderDisplayName: remoteParticipant.displayName,
      type: 'text',
      metadata: {
        fileSharingMetadata: JSON.stringify([
          { name: 'SampleFile1.pdf', extension: 'pdf', attachmentType: 'fileSharing' }
        ])
      }
    }
  );
};

const sendRemoteInlineImageMessage = (
  chatClientModel: Model,
  localParticipant: ChatParticipant,
  remoteParticipant: ChatParticipant,
  threadId: string
): void => {
  const thread: Thread = chatClientModel.checkedGetThread(localParticipant.id, threadId);
  const messageWithInlineImage: ChatMessage = {
    id: `${thread.messages.length}`,
    type: 'html',
    sequenceId: `${thread.messages.length}`,
    version: '0',
    content: {
      message:
        '<p>Test</p><p><img alt="image" src="" itemscope="png" width="200" height="300" id="SomeImageId1" style="vertical-align:bottom"></p><p>&nbsp;</p>',
      attachments: [
        {
          id: 'SomeImageId1',
          attachmentType: 'inlineImage',
          contentType: 'png',
          name: '',
          url: 'images/inlineImageExample1.png',
          previewUrl: 'images/inlineImageExample1.png'
        }
      ]
    },
    senderDisplayName: remoteParticipant.displayName,
    createdOn: new Date(Date.now()),
    sender: getIdentifierKind(remoteParticipant.id)
  };

  chatClientModel.modifyThreadForUser(localParticipant.id, threadId, (thread) => {
    thread.messages = [...thread.messages, messageWithInlineImage];
  });

  chatClientModel
    .checkedGetThreadEventEmitter(localParticipant.id, threadId)
    .chatMessageReceived([localParticipant.id], {
      id: messageWithInlineImage.id,
      createdOn: messageWithInlineImage.createdOn,
      version: messageWithInlineImage.version,
      type: messageWithInlineImage.type,
      message: messageWithInlineImage.content?.message ?? '',
      attachments: messageWithInlineImage.content?.attachments,
      threadId: threadId,
      sender: getIdentifierKind(remoteParticipant.id),
      senderDisplayName: remoteParticipant.displayName ?? '',
      recipient: getIdentifierKind(localParticipant.id),
      metadata: {}
    });
};
