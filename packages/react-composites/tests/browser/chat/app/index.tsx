// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { MessageProps, _IdentifierProvider } from '@internal/react-components';
import {
  ChatAdapter,
  createAzureCommunicationChatAdapter,
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR
} from '../../../../src';
import { IDS } from '../../common/constants';
import { verifyParamExists } from '../../common/testAppUtils';
import { fromFlatCommunicationIdentifier } from '@internal/acs-ui-common';
import { initializeIcons, Stack } from '@fluentui/react';

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

// Needed to initialize default icons used by Fluent components.
initializeIcons();

function App(): JSX.Element {
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      setChatAdapter(
        await createAzureCommunicationChatAdapter({
          endpoint,
          userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
          displayName,
          credential: new AzureCommunicationTokenCredential(token),
          threadId
        })
      );
    };

    initialize();

    return () => chatAdapter && chatAdapter.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {!chatAdapter && 'Initializing chat adapter...'}
      {chatAdapter && (
        <_IdentifierProvider identifiers={IDS}>
          <ChatComposite
            adapter={chatAdapter}
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
            options={{ participantPane: true }}
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
