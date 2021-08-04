// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallComposite, createAzureCommunicationCallAdapter } from '@azure/communication-react';

export const loadCallComposite = async function (args, htmlElement) {
  const { userId, token, groupId, displayName } = args;
  const adapter = await createAzureCommunicationCallAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    locator: { groupId }
  });
  ReactDOM.render(React.createElement(CallComposite, { adapter }, null), htmlElement);
  return adapter;
};
