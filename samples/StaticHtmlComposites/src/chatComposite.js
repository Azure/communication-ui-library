// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';

export const loadChatComposite = async function (args, htmlElement, props) {
  const { userId, token, endpoint, threadId, displayName } = args;
  const adapter = await createAzureCommunicationChatAdapter({
    endpoint,
    userId,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    threadId
  });
  ReactDOM.render(React.createElement(ChatComposite, { ...props, adapter }, null), htmlElement);
  return adapter;
};
