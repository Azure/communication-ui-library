import { CommunicationUserIdentifier } from '@azure/communication-common';
import { ChatAdapter, ChatComposite, createAzureCommunicationChatAdapter } from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  showParticipants?: boolean;
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
          await createAzureCommunicationChatAdapter(
            props.userId,
            props.token,
            props.endpointUrl,
            props.threadId,
            props.displayName
          )
        );
      };
      createAdapter();
    }
  }, [props]);

  return (
    <>
      {adapter ? (
        <ChatComposite
          adapter={adapter}
          fluentTheme={props.fluentTheme}
          options={{ showParticipantPane: props.showParticipants }}
        />
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};
