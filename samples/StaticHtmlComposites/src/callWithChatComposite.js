// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallWithChatComposite, createAzureCommunicationCallWithChatAdapter } from '@azure/communication-react';

export const loadCallWithChatComposite = async function (args, htmlElement, props) {
  const { userId, token, displayName, locator, endpoint, alternateCallerId } = args;
  const adapter = await createAzureCommunicationCallWithChatAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    endpoint: endpoint,
    // groupId: locator,
    locator: locator,
    alternateCallerId
  });
  ReactDOM.render(React.createElement(CallWithChatComposite, { ...props, adapter }, null), htmlElement);
  return adapter;
};
