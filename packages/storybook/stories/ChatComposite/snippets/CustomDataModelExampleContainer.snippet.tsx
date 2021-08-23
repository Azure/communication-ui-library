import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  getIdentifierKind
} from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { PartialTheme, Theme } from '@fluentui/react';
import React, { useState, useEffect } from 'react';

export interface CustomDataModelExampleContainerProps {
  userId: CommunicationUserIdentifier;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  botUserId: string;
  botAvatar: string;
  fluentTheme?: PartialTheme | Theme;
}

export const CustomDataModelExampleContainer = (props: CustomDataModelExampleContainerProps): JSX.Element => {
  // Creating an adapter is asynchronous.
  // An update to `config` triggers a new adapter creation, via the useEffect block.
  // When the adapter becomes ready, the state update triggers a re-render of the ChatComposite.
  const [adapter, setAdapter] = useState<ChatAdapter>();
  useEffect(() => {
    if (props) {
      const createAdapter = async (): Promise<void> => {
        setAdapter(
          await createAzureCommunicationChatAdapter({
            endpointUrl: props.endpointUrl,
            userId: getIdentifierKind(props.userId),
            // Data model injection: The display name for the local user comes from Contoso's data model.
            displayName: props.displayName,
            credential: new AzureCommunicationTokenCredential(props.token),
            threadId: props.threadId
          })
        );
      };
      createAdapter();
    }
  }, [props]);

  // Data model injection: Contoso provides avatars for the chat bot participant.
  // Unlike the displayName example above, this sets the avatar for the remote bot participant.
  //
  // Note: Chat Composite doesn't implement a memoization mechanism for this callback.
  // It is recommended that Contoso memoize the `onFetchAvatarPersonaData` callback
  // to avoid costly re-fetching of data.
  // A 3rd Party utility such as Lodash (_.memoize) can be used to memoize the callback.
  const onFetchAvatarPersonaData = (userId): Promise<AvatarPersonaData> =>
    new Promise((resolve, reject) => {
      if (userId === props.botUserId) {
        return resolve({
          imageInitials: props.botAvatar,
          initialsColor: 'white'
        });
      }
    });

  return (
    <>
      {adapter ? (
        <ChatComposite
          fluentTheme={props.fluentTheme}
          adapter={adapter}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          options={{ showParticipantPane: true, showTopic: true }}
        />
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
};
