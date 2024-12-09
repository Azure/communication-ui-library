import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatComposite,
  CompositeLocale,
  fromFlatCommunicationIdentifier,
  ParticipantMenuItemsCallback,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { IContextualMenuItem, PartialTheme, Theme } from '@fluentui/react';
import React, { useMemo } from 'react';

export interface CustomDataModelExampleContainerProps {
  /** UserIdentifier is of type CommunicationUserIdentifier see below how to construct it from a string input */
  userIdentifier: string;
  token: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  remoteParticipantUserId: string;
  remoteParticipantAvatar: string;
  fluentTheme?: PartialTheme | Theme;
  rtl?: boolean;
  locale?: CompositeLocale;
}

export const CustomDataModelExampleContainer = (props: CustomDataModelExampleContainerProps): JSX.Element => {
  // Arguments to `useAzureCommunicationChatAdapter` must be memoized to avoid recreating adapter on each render.
  const credential = useMemo(() => new AzureCommunicationTokenCredential(props.token), [props.token]);

  const userId = useMemo(
    () => fromFlatCommunicationIdentifier(props.userIdentifier) as CommunicationUserIdentifier,
    [props.userIdentifier]
  );

  const adapter = useAzureCommunicationChatAdapter({
    endpoint: props.endpointUrl,
    userId,
    // Data model injection: The display name for the local user comes from Contoso's data model.
    displayName: props.displayName,
    credential,
    threadId: props.threadId
  });

  // Data model injection: Contoso provides avatars for the chat remote participant participant.
  // Unlike the displayName example above, this sets the avatar for the remote participant.
  //
  // Note: Chat Composite doesn't implement a memoization mechanism for this callback.
  // It is recommended that Contoso memoize the `onFetchAvatarPersonaData` callback
  // to avoid costly re-fetching of data.
  // A 3rd Party utility such as Lodash (_.memoize) can be used to memoize the callback.
  const onFetchAvatarPersonaData = (userId: string): Promise<AvatarPersonaData> =>
    new Promise((resolve) => {
      if (userId === props.remoteParticipantUserId) {
        return resolve({
          imageInitials: props.remoteParticipantAvatar,
          initialsColor: 'white'
        });
      }
    });

  // Custom Menu Item Callback for Participant List
  const onFetchParticipantMenuItems: ParticipantMenuItemsCallback = (participantId, userId, defaultMenuItems) => {
    console.log('Remote Participant', participantId);
    console.log('Current Participant', userId);
    let customMenuItems: IContextualMenuItem[] = [
      {
        key: 'Custom Menu Item',
        text: 'Custom Menu Item',
        onClick: () => console.log('Custom Menu Item Clicked')
      }
    ];
    if (defaultMenuItems) {
      customMenuItems = customMenuItems.concat(defaultMenuItems);
    }
    return customMenuItems;
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      {adapter ? (
        <ChatComposite
          fluentTheme={props.fluentTheme}
          rtl={props.rtl ?? false}
          adapter={adapter}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          onFetchParticipantMenuItems={onFetchParticipantMenuItems}
          locale={props.locale}
          options={{ participantPane: true }}
        />
      ) : (
        <h3>Loading...</h3>
      )}
    </div>
  );
};
