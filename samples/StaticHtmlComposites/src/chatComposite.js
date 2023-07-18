// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';
import { initializeIcons } from '@fluentui/react';
initializeIcons();
export const loadChatComposite = async function (args, htmlElement, props) {
  const { userId, token, endpoint, threadId, displayName } = args;
  const adapter = await createAzureCommunicationChatAdapter({
    endpoint,
    userId,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    threadId
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(ChatComposite, { ...props, adapter }, null));
  return adapter;
};
