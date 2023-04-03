// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { Stack } from '@fluentui/react';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { _IdentifierProvider, FileDownloadError, FileDownloadHandler, MessageProps } from '@internal/react-components';
import React, { useMemo } from 'react';
import { ChatComposite, COMPOSITE_LOCALE_FR_FR, useAzureCommunicationChatAdapter } from '../../../src';
// eslint-disable-next-line no-restricted-imports
import { IDS } from '../../browser/common/constants';
import { verifyParamExists } from '../lib/utils';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

/**
 * App with chat composite using an ACS chat adapter
 */
export const LiveTestApp = (): JSX.Element => {
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
  const uploadedFiles = React.useMemo(() => (params.uploadedFiles ? JSON.parse(params.uploadedFiles) : []), []);
  const showParticipantPane = params.showParticipantPane === 'true' ? true : false;

  const args = useMemo(
    () => ({
      endpoint,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      credential: new AzureCommunicationTokenCredential(token),
      threadId
    }),
    [displayName, endpoint, token, threadId, userId]
  );
  const adapter = useAzureCommunicationChatAdapter(args, async (adapter) => {
    // fetch initial data before we render the component to avoid flaky test (time gap between header and participant list)
    try {
      await adapter.fetchInitialData();
      return adapter;
    } catch {
      // If we fail on fetching the initial data we still want to return just the adapter.
      return adapter;
    }
  });

  React.useEffect(() => {
    if (adapter && uploadedFiles.length) {
      uploadedFiles.forEach((file) => {
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
    }
  }, [adapter, uploadedFiles]);

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
              participantPane: showParticipantPane,
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
};

function getMessageContentInUppercase(messageProps: MessageProps): string {
  const message = messageProps.message;
  switch (message.messageType) {
    case 'chat':
    case 'custom':
      return (message.content ?? '').toUpperCase();
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
  throw new Error('unreachable code');
}
