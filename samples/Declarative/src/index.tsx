// © Microsoft Corporation. All rights reserved.

import { AzureCommunicationUserCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import { ChatThreadState, createDeclarativeChatThreadClient } from '@azure/communication-ui';

const testDeclarativeListMessages = async (): Promise<void> => {
  const getEndpointResponse = await fetch('/getEndpointUrl', { method: 'GET' });
  const endpointUrl = await getEndpointResponse.text().then((endpointUrl) => endpointUrl);
  const getTokenResponse = await fetch('/token', { method: 'POST' });
  const token = await getTokenResponse.json().then((_responseJson) => {
    return { token: _responseJson.token, id: _responseJson.user.communicationUserId };
  });
  const credential = new AzureCommunicationUserCredential(token.token);
  const createThreadResponse = await fetch('/createThread', { method: 'POST' });
  const threadId = await createThreadResponse.text();
  await fetch(`/addUser/${threadId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ Id: token.id, DisplayName: 'User1' })
  });
  const chatClient = new ChatClient(endpointUrl, credential);
  const chatThreadClient = await chatClient.getChatThreadClient(threadId);
  for (let i = 0; i < 10; i++) {
    await chatThreadClient.sendMessage({ content: 'Message ' + i, senderDisplayName: 'User1' } as any);
  }
  const declarativeChatThreadClient = createDeclarativeChatThreadClient(chatThreadClient);
  console.log('TestDeclarativeListMessages initial state ', declarativeChatThreadClient.getState());
  declarativeChatThreadClient.onStateChange((state: ChatThreadState) => {
    console.log('TestDeclarativeListMessages onStateChange', state);
  });
  const listMessageIterator = declarativeChatThreadClient.listMessages({ maxPageSize: 100 });
  const pagess = listMessageIterator.byPage();
  for await (const page of pagess) {
    for (const message of page) {
      console.log(message);
    }
  }
  /*
  for (let i = 0; i < 10; i++) {
    console.log('iterator', listMessageIterator);
    const message = await listMessageIterator.next();
    console.log('message', message);
    // console.log('TestDeclarativeMessages listMessages returned', message);
  }
  console.log('end');
  */
  // const it = chatThreadClient.listMessages({ maxPageSize: 100 });
  // const pages = chatThreadClient.listMessages({ maxPageSize: 100 }).byPage({ maxPageSize: 2 });
  // console.log(pages);
  // console.log(await pages.next());
  /*
  for await (const page of pages) {
    for (const message of page) {
      console.log(message);
    }
  }
  */
};

testDeclarativeListMessages();
