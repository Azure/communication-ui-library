// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatParticipant } from '@azure/communication-chat';
import { toFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { _createStatefulChatClientWithDeps } from '@internal/chat-stateful-client';
import { _IdentifierProvider, FileDownloadError, FileDownloadHandler } from '@internal/react-components';
import React, { useEffect } from 'react';
import { ChatAdapter, ChatComposite, COMPOSITE_LOCALE_FR_FR } from '../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../browser/common/constants';
import {
  customOnFetchAvatarPersonaData,
  customOnRenderMessage,
  customOnRenderTypingIndicator
} from './CustomDataModel';
import { FakeChatClient, Model } from '@internal/fake-backends';
import { FakeChatAdapterArgs, FileUpload } from '../../common';
import { useFakeChatAdapters } from '../lib/useFakeChatAdapters';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());
const fakeChatAdapterArgs = params.fakeChatAdapterArgs
  ? (JSON.parse(params.fakeChatAdapterArgs) as FakeChatAdapterArgs)
  : undefined;

/**
 * App with chat composite using a fake Chat adapter
 */
export const FakeAdapterApp = (): JSX.Element => {
  if (!fakeChatAdapterArgs) {
    throw new Error('fakeChatAdapterArgs not set');
  }

  const fakeAdapters = useFakeChatAdapters(fakeChatAdapterArgs);

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
      {fakeAdapters.remotes && createHiddenComposites(fakeAdapters.remotes)}
    </>
  );
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
        fileSharingMetadata: JSON.stringify([{ name: 'SampleFile1.pdf', extension: 'pdf' }])
      }
    }
  );
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
