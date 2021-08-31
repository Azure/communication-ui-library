// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  getIdentifierKind
} from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  CompositeLocale,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useState, useEffect } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  locale?: CompositeLocale;
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
      const newAdapter = await createAzureCommunicationChatAdapter({
        endpointUrl: props.endpointUrl,
        userId: getIdentifierKind(props.userId),
        displayName: props.displayName,
        credential: new AzureCommunicationTokenCredential(props.token),
        threadId: props.threadId
      });

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

  return (
    <>
      {adapter ? (
        <ChatComposite
          fluentTheme={props.fluentTheme}
          locale={props.locale}
          adapter={adapter}
          visualElements={{ errorBar: true, participantPane: true, topic: true }}
        />
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};
