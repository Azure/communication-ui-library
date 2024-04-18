// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { createRoot } from 'react-dom/client';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallComposite,
  createAzureCommunicationCallAdapter,
  fromFlatCommunicationIdentifier
} from '@azure/communication-react';
import { initializeIcons } from '@fluentui/react';
initializeIcons();
export const loadCallComposite = async function (args, htmlElement, props) {
  const { userId, token, displayName, targetCallees, options } = args;
  const adapter = await createAzureCommunicationCallAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    targetCallees: targetCallees || [
      targetCallees.foreach((callee) => {
        return fromFlatCommunicationIdentifier(callee);
      })
    ],
    options
  });

  if (!htmlElement) {
    throw new Error('Failed to find the root element');
  }

  createRoot(htmlElement).render(React.createElement(CallComposite, { ...props, adapter }, null));
  return adapter;
};
