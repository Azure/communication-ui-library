import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  CompositeLocale,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  locale?: CompositeLocale;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    if (!props) {
      return;
    }

    const createAdapter = async (): Promise<void> => {
      const chatAdapter = await createAzureCommunicationChatAdapter({
        endpoint: props.endpointUrl,
        userId: props.userId,
        displayName: props.displayName,
        credential: new AzureCommunicationTokenCredential(props.token),
        threadId: props.threadId
      });

      // Custom behavior: Intercept messages from the local user and convert
      // to uppercase before sending to backend.
      const sendMessage = chatAdapter.sendMessage.bind(chatAdapter);
      chatAdapter.sendMessage = async (content: string): Promise<void> => {
        await sendMessage(content.toUpperCase());
      };

      setAdapter(chatAdapter);
    };

    createAdapter();
  }, [props]);

  return (
    <>
      {adapter ? (
        <div style={{ height: '100vh', width: '100vw' }}>
          <ChatComposite adapter={adapter} locale={props.locale} />
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};
