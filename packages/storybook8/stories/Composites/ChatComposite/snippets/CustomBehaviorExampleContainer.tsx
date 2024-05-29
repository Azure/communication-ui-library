// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  CompositeLocale,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  locale?: CompositeLocale;
};

export const ContosoChatContainer = (props: ContainerProps): JSX.Element => {
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.token), [props.token]);
  const adapter = useAzureCommunicationChatAdapter(
    {
      endpoint: props.endpointUrl,
      userId: props.userId,
      displayName: props.displayName,
      credential,
      threadId: props.threadId
    },
    // Modify the adapter once it is created.
    sendAllMessagesInUpperCase
  );

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {adapter ? (
        <ChatComposite
          fluentTheme={props.fluentTheme}
          rtl={props.rtl ?? false}
          locale={props.locale}
          adapter={adapter}
          options={{ participantPane: true }}
        />
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
};

async function sendAllMessagesInUpperCase(adapter: ChatAdapter): Promise<ChatAdapter> {
  // Custom behavior: Intercept messages from the local user and convert
  // to uppercase before sending to backend.
  const superSendMessage = adapter.sendMessage.bind(adapter);
  adapter.sendMessage = async (content: string): Promise<void> => {
    await superSendMessage(content.toUpperCase());
  };
  return adapter;
}
