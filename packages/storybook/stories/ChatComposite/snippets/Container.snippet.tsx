import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  getIdentifierKind
} from '@azure/communication-common';
import {
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter,
  AvatarPersonaDataProvider,
  AvatarPersonaData
} from '@azure/communication-react';
import { Theme, PartialTheme } from '@fluentui/react';
import _ from 'lodash';
import React, { useState, useEffect, useMemo } from 'react';

// Sample usage of Custom Data Provider for AvatarPersona with Memoization.
// Contoso is responsible for memoizing the provider function.
const avatarPersonaDataProvider: AvatarPersonaDataProvider = (userId?: string): Promise<AvatarPersonaData> =>
  new Promise((resolve) => {
    console.log('Inside avatarPersonaDataProvider userId: ', userId);
    return resolve({
      text: 'Custom Name',
      initialsColor: 'firebrick',
      initialsTextColor: 'black'
    });
  });

const memoizedAvatarDataProvider = _.memoize(avatarPersonaDataProvider);

export type ContainerProps = {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  fluentTheme?: PartialTheme | Theme;
  showParticipants?: boolean;
  showTopic?: boolean;
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
            userId: getIdentifierKind(props.userId),
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
        avatarPersonaDataProvider={memoizedAvatarDataProvider}
        adapter={adapter}
        fluentTheme={props.fluentTheme}
        options={{ showParticipantPane: props.showParticipants }}
      />
    );
  }
  if (credential === undefined) {
    return <>Failed to construct credential. Provided token is malformed.</>;
  }
  return <>Initializing...</>;
};
