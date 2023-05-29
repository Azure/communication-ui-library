// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';
import { initializeIcons } from '@fluentui/react';
initializeIcons();
export const loadCallComposite = async function (args, htmlElement, props) {
  const { userId, token, groupId, displayName, locator } = args;
  const adapter = await createAzureCommunicationCallAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    locator: locator || { groupId }
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallComposite, { ...props, adapter }, null));
  return adapter;
};
