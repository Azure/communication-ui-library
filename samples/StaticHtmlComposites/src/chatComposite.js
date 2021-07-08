// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import { ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';

export const loadChatComposite = async function (args, htmlElement) {
  const { userId, token, endpointUrl, threadId, displayName } = args;
  const adapter = await createAzureCommunicationChatAdapter(
    userId,
    token,
    endpointUrl,
    threadId,
    displayName ?? 'anonymous'
  );
  ReactDOM.render(React.createElement(ChatComposite, { adapter }, null), htmlElement);
  return adapter;
};
