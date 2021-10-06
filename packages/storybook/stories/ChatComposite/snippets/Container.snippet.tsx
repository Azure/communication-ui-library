import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  CompositeLocale,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  errorBar?: boolean;
  participants?: boolean;
  topic?: boolean;
  locale?: CompositeLocale;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => {
    try {
      return new AzureCommunicationTokenCredential(props.token);
    } catch {
      console.error('Failed to construct token credential');
      return undefined;
    }
  }, [props.token]);

  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (!!credential && props) {
      const createAdapter = async (credential: AzureCommunicationTokenCredential): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter({
            endpointUrl: props.endpointUrl,
            userId: props.userId,
            displayName: props.displayName,
            credential,
            threadId: props.threadId
          })
        );
      };
      createAdapter(credential);
    }
  }, [props, credential]);

  if (adapter) {
    return (
      <ChatComposite
        adapter={adapter}
        fluentTheme={props.fluentTheme}
        options={{
          errorBar: props.errorBar,
          participantPane: props.participants,
          topic: props.topic
        }}
        locale={props.locale}
      />
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};
