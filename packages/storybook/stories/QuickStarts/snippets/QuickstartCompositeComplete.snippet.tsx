import {
  CallComposite,
  CallAdapter,
  createAzureCommunicationCallAdapter,
  ChatComposite,
  ChatAdapter,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

function App(): JSX.Element {
  const endpointUrl = 'ADD ENDPOINT URL FOR RESOURCE';
  const displayName = 'ADD DISPLAYE NAME';
  const token = 'ADD ACCESS TOKEN WITH VOIP AND CHAT SCOPE';

  //Calling Variables
  const groupId = 'ADD GROUP ID TO JOIN';
  const [callAdapter, setCallAdapter] = useState<CallAdapter>();

  //Chat Variables
  const threadId = 'ADD THREAD ID TO JOIN';
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    const createAdapter = async (): Promise<void> => {
      setChatAdapter(await createAzureCommunicationChatAdapter(token, endpointUrl, threadId, displayName));
      setCallAdapter(await createAzureCommunicationCallAdapter(token, groupId, displayName));
    };
    createAdapter();
  });

  return (
    <>
      {chatAdapter && <ChatComposite adapter={chatAdapter} />}
      {callAdapter && <CallComposite adapter={callAdapter} />}
    </>
  );
}

export default App;
