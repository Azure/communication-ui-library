import { CommunicationUserIdentifier } from '@azure/communication-common';
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
            props.userId,
            props.accessToken,
            props.endpointUrl,
            props.threadId,
            props.displayName
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
