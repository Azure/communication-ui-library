// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { _IdentifierProvider } from '@internal/react-components';
import {
  ChatAdapter,
  createAzureCommunicationChatAdapter,
  ChatComposite,
  COMPOSITE_LOCALE_FR_FR
} from '../../../../src';
import { IDS } from '../../common/constants';
import { verifyParamExists } from '../../common/testAppUtils';

const urlSearchParams = new URLSearchParams(window.location.search);
const params = Object.fromEntries(urlSearchParams.entries());

// Required params
const displayName = verifyParamExists(params.displayName, 'displayName');
const token = verifyParamExists(params.token, 'token');
const endpointUrl = verifyParamExists(params.endpointUrl, 'endpointUrl');
const threadId = verifyParamExists(params.threadId, 'threadId');
const userId = verifyParamExists(params.userId, 'userId');

// Optional params
const useFrLocale = Boolean(params.useFrLocale);
const customDataModel = params.customDataModel;

function App(): JSX.Element {
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter | undefined>(undefined);

  useEffect(() => {
    const initialize = async (): Promise<void> => {
      setChatAdapter(
        await createAzureCommunicationChatAdapter({
          endpointUrl,
          userId: { kind: 'communicationUser', communicationUserId: userId },
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
    <_IdentifierProvider identifiers={IDS}>
      {chatAdapter && (
        <ChatComposite
          adapter={chatAdapter}
          onRenderTypingIndicator={
            customDataModel
              ? () => <text id="custom-data-model-typing-indicator">Someone is typing...</text>
              : undefined
          }
          onRenderMessage={
            customDataModel
              ? (messageProps) => (
                  <text
                    data-ui-status={messageProps.message.messageType === 'chat' ? messageProps.message.status : ''}
                    id="custom-data-model-message"
                  >
                    Custom Message
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
        />
      )}
    </_IdentifierProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
