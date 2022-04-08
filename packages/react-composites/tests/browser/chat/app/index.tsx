// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { Stack } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { MessageProps, _IdentifierProvider } from '@internal/react-components';
import React, { useMemo } from 'react';
import ReactDOM from 'react-dom';
import {
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR,
  FileDownloadError,
  FileDownloadHandler,
  useAzureCommunicationChatAdapter
} from '../../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../common/constants';
import { initializeIconsForUITests, verifyParamExists } from '../../common/testAppUtils';

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
const uploadedFiles = params.uploadedFiles ? JSON.parse(params.uploadedFiles) : [];

// Needed to initialize default icons used by Fluent components.
initializeFileTypeIcons();
initializeIconsForUITests();

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
  const adapter = useAzureCommunicationChatAdapter(args, async (adapter) => {
    // fetch initial data before we render the component to avoid flaky test (time gap between header and participant list)
    await adapter.fetchInitialData();
    return adapter;
  });

  React.useEffect(() => {
    if (adapter && uploadedFiles.length) {
      uploadedFiles.forEach((file) => {
        if (file.error) {
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
      if (fileData.name !== 'Unauthorized.pdf') {
        resolve(new URL(fileData.url));
      } else {
        resolve({ errorMessage: 'You don’t have permission to download this file.' });
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
