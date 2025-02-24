// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatParticipant, ChatMessage } from '@azure/communication-chat';
import { getIdentifierKind } from '@azure/communication-common';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { _IdentifierProvider, lightTheme, darkTheme } from '@internal/react-components';
import React, { useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR,
  _FakeChatAdapterArgs,
  _useFakeChatAdapters,
  _MockAttachmentUpload
} from '../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../browser/common/constants';
import {
  customOnFetchAvatarPersonaData,
  customOnRenderMessage,
  customOnRenderTypingIndicator
} from './CustomDataModel';
/* @conditional-compile-remove(composite-onRenderAvatar-API) */
import { customOnRenderAvatar } from './CustomDataModel';
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

      if (fakeChatAdapterArgs.sendRemoteFileSharingMessage && fakeChatAdapterArgs.remoteParticipants[0]) {
        sendRemoteFileSharingMessage(
          fakeAdapters.service.model,
          fakeChatAdapterArgs.remoteParticipants[0],
          fakeAdapters.service.threadId
        );
      }

      if (fakeChatAdapterArgs.sendRemoteInlineImageMessage && fakeChatAdapterArgs.remoteParticipants[0]) {
        sendRemoteInlineImageMessage(
          fakeAdapters.service.model,
          fakeChatAdapterArgs.localParticipant,
          fakeChatAdapterArgs.remoteParticipants[0],
          fakeAdapters.service.threadId,
          fakeChatAdapterArgs.serverUrl ?? ''
        );
      }
    })();
  }, [fakeAdapters]);

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
              attachmentOptions: fakeChatAdapterArgs.fileSharingEnabled
                ? {
                    uploadOptions: {
                      handleAttachmentSelection: () => {}
                    }
                  }
                : undefined
            }}
            onFetchAvatarPersonaData={
              fakeChatAdapterArgs.customDataModelEnabled ? customOnFetchAvatarPersonaData : undefined
            }
            /* @conditional-compile-remove(composite-onRenderAvatar-API) */
            onRenderAvatar={fakeChatAdapterArgs.customDataModelEnabled ? customOnRenderAvatar : undefined}
            fluentTheme={fakeChatAdapterArgs.theme === 'dark' ? darkTheme : lightTheme}
          />
        </_IdentifierProvider>
      )}
      <HiddenChatComposites adapters={fakeAdapters.remotes} />
    </>
  );
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
          { name: 'SampleFile1.pdf', extension: 'pdf', attachmentType: 'file', id: uuidv4() }
        ])
      }
    }
  );
};

const sendRemoteInlineImageMessage = (
  chatClientModel: Model,
  localParticipant: ChatParticipant,
  remoteParticipant: ChatParticipant,
  threadId: string,
  serverUrl: string
): void => {
  const localParticipantId = getIdentifierKind(localParticipant.id);
  const remoteParticipantId = getIdentifierKind(remoteParticipant.id);
  const imgSrcPreview = serverUrl + '/images/inlineImageExample1.png';
  const imgSrcFullSize = serverUrl + '/images/inlineImageExample1-fullSize.png';
  if (localParticipantId.kind === 'microsoftTeamsApp' || remoteParticipantId.kind === 'microsoftTeamsApp') {
    throw new Error('Unsupported identifier kind: microsoftBot');
  }

  const thread: Thread = chatClientModel.checkedGetThread(localParticipant.id, threadId);
  const messageWithInlineImage: ChatMessage = {
    id: `${thread.messages.length}`,
    type: 'html',
    sequenceId: `${thread.messages.length}`,
    version: '0',
    content: {
      message: `<p>Test</p><p><img alt="image" src="${imgSrcPreview}" itemscope="png" width="200" height="300" id="SomeImageId1" style="vertical-align:bottom; aspect-ratio: 200 / 300;"></p><p>&nbsp;</p>`,
      attachments: [
        {
          id: 'SomeImageId1',
          attachmentType: 'image',
          name: '',
          url: imgSrcFullSize,
          previewUrl: imgSrcPreview
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
      sender: remoteParticipantId,
      senderDisplayName: remoteParticipant.displayName ?? '',
      recipient: localParticipantId,
      metadata: {}
    });
};
