import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  getIdentifierKind
} from '@azure/communication-common';
import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';
import React, { useState, useEffect } from 'react';

type ChatAdapterExampleProps = {
  userId: CommunicationUserIdentifier;
  accessToken: string;
  endpointUrl: string;
  threadId: string;
  displayName: string;
};

export const ChatAdapterExample = (props: ChatAdapterExampleProps): JSX.Element | undefined => {
  const [chatAdapter, setChatAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (props) {
      const createAdapter = async (): Promise<void> => {
        setChatAdapter(
          await createAzureCommunicationChatAdapter(
            props.endpointUrl,
            getIdentifierKind(props.userId),
            props.displayName,
            new AzureCommunicationTokenCredential(props.accessToken),
            props.threadId
          )
        );
      };
      createAdapter();
    }
    return () => {
      if (chatAdapter) {
        chatAdapter.dispose();
      }
    };
  }, [props]);

  return chatAdapter && <ChatComposite adapter={chatAdapter} />;
};
