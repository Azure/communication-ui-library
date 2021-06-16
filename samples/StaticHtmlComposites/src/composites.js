// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import {
  CallComposite,
  createAzureCommunicationCallAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';

export const loadCallComposite = async function (args) {
  const { containerId, userId, token, groupId, displayName } = args;
  const adapter = await createAzureCommunicationCallAdapter(/*userId,*/ token, { groupId }, displayName ?? 'anonymous');
  ReactDOM.render(React.createElement(CallComposite, { adapter }, null), document.getElementById(containerId));
  return adapter;
};

export const loadChatComposite = async function (args) {
  const { containerId, userId, token, endpointUrl, threadId, displayName } = args;
  const adapter = await createAzureCommunicationChatAdapter(
    /*userId,*/ token,
    endpointUrl,
    threadId,
    displayName ?? 'anonymous'
  );
  ReactDOM.render(React.createElement(ChatComposite, { adapter }, null), document.getElementById(containerId));
  return adapter;
};
