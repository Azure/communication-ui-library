// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
export { v4 as createGUID } from 'uuid';

// In your real app, your authenticated service should create users and issue tokens.
// For more info, see https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript

export const loadConfigFromUrlQuery = () => {
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  return {
    displayName: params.displayName,
    token: params.token,
    endpointUrl: params.endpointUrl,
    threadId: params.threadId,
    userId: params.userId,
    customDataModel: params.customDataModel
  };
};

export const createUserWithToken = async () => {
  // Calling the samples/Server. In your real app, your authenticated service should create users and issue tokens.
  // For more info, see https://docs.microsoft.com/azure/communication-services/quickstarts/access-tokens?pivots=programming-language-javascript
  return (await fetch('token?scope=chat,voip')).json();
};

export const createChatThread = async () => {
  return (await fetch('createThread', { method: 'POST' })).text();
};

export const addChatUser = async (threadId, user, displayName) => {
  await fetch(`addUser/${threadId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Id: user.communicationUserId, DisplayName: displayName })
  });
};

export const getEndpointUrl = async () => {
  // Pure convenience for running this sample, you would hard-code your Azure Communication Resource domain instead.
  return (await fetch('getEndpointUrl')).text();
};
