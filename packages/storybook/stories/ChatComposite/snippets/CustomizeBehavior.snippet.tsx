import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  getIdentifierKind
} from '@azure/communication-common';
import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  const [adapter, setAdapter] = useState<ChatAdapter>();

  useEffect(() => {
    if (!props) return;

    const createAdapter = async (): Promise<void> => {
      const chatAdapter = await createAzureCommunicationChatAdapter(
        props.endpointUrl,
        getIdentifierKind(props.userId),
        props.displayName,
        new AzureCommunicationTokenCredential(props.token),
        props.threadId
      );

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
        <ChatComposite adapter={adapter} options={{ showParticipantPane: true, showTopic: true }} />
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};
