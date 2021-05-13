import React, { useState, useEffect } from 'react';
import { ChatAdapter, ChatConfig, ChatComposite, createAzureCommunicationChatAdapter } from 'react-composites';

export const ContosoChatContainer = (props: { config: ChatConfig | undefined }): JSX.Element => {
  const { config } = props;

  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (!config) {
      return;
    }

    const createAdapter = async (): Promise<void> => {
      const newAdapter = await createAzureCommunicationChatAdapter(
        config.token,
        config.endpointUrl,
        config.threadId,
        config.displayName
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
  }, [config]);

  return <>{adapter ? <ChatComposite adapter={adapter} /> : <h3>Loading...</h3>}</>;
};
