import React, { useState, useEffect } from 'react';
import { ChatAdapter, ChatConfig, ChatComposite, createAzureCommunicationChatAdapter } from 'react-composites';

export const ContosoChatContainer = (props: { config: ChatConfig | undefined }): JSX.Element => {
  const { config } = props;

  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (config) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter(
            config.token,
            config.endpointUrl,
            config.threadId,
            config.displayName
          )
        );
      };
      createAdapter();
    }
  }, [config]);

  return <>{adapter ? <ChatComposite adapter={adapter} /> : <h3>Loading...</h3>}</>;
};
