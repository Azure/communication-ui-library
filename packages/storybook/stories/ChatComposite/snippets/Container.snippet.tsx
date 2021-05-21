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
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (props) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter(props.token, props.endpointUrl, props.threadId, props.displayName)
        );
      };
      createAdapter();
    }
  }, [props]);

  return <>{adapter ? <ChatComposite adapter={adapter} /> : <h3>Loading...</h3>}</>;
};
