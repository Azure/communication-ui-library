// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { CallWithChatComposite, createAzureCommunicationCallWithChatAdapter } from '@azure/communication-react';

// locator is a different type of custom locator to aggregate a call locator and a chat thread
// locator = { callLocator: CallLocator, chatThreadId : string }
export const loadCallWithChatComposite = async function (args, htmlElement, props) {
  const { userId, token, displayName, endpoint, locator, threadId } = args;
  const adapter = await createAzureCommunicationCallWithChatAdapter({
    userId,
    displayName: displayName ?? 'anonymous',
    credential: new AzureCommunicationTokenCredential(token),
    endpoint: endpoint,
    locator: locator
  });
  ReactDOM.render(React.createElement(CallWithChatComposite, { ...props, adapter }, null), htmlElement);
  return adapter;
};
