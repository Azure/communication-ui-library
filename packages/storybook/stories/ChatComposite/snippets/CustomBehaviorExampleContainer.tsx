// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  // Creating an adapter is asynchronous.
  // An update to `props` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (!props) {
      return;
    }

    const createAdapter = async (): Promise<void> => {
      const newAdapter = await createAzureCommunicationChatAdapter(
        props.token,
        props.endpointUrl,
        props.threadId,
        props.displayName
      );

      // Custom behavior: Intercept messages from the local user and convert
      // to uppercase before sending to backend.
      const superSendMessage = newAdapter.sendMessage.bind(newAdapter);
      newAdapter.sendMessage = async (content: string): Promise<void> => {
        await superSendMessage(content.toUpperCase());
      };

      setAdapter(newAdapter);
    };

    createAdapter();
  }, [props]);

  return <>{adapter ? <ChatComposite adapter={adapter} /> : <h3>Loading...</h3>}</>;
};
