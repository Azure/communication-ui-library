// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter,
  fromFlatCommunicationIdentifier
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';

import { ChatHeader } from './ChatHeader';
import {
  chatCompositeContainerStyle,
  chatHeaderContainerStyle,
  chatScreenContainerStyle
} from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  endChatHandler(): void;
  errorHandler(): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, threadId, token, userId, errorHandler, endChatHandler } = props;

  const adapterRef = useRef<ChatAdapter>();
  const [adapter, setAdapter] = useState<ChatAdapter>();
  const [hideParticipants, setHideParticipants] = useState<boolean>(false);
  const { currentTheme } = useSwitchableFluentTheme();

  useEffect(() => {
    (async () => {
      const adapter = await createAzureCommunicationChatAdapter({
        endpoint: endpointUrl,
        userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
        displayName: displayName,
        credential: createAutoRefreshingCredential(userId, token),
        threadId: threadId
      });
      adapter.on('participantsRemoved', (listener) => {
        // Note: We are receiving ChatParticipant.id from communication-signaling, so of type 'CommunicationIdentifierKind'
        // while it's supposed to be of type 'CommunicationIdentifier' as defined in communication-chat
        const removedParticipantIds = listener.participantsRemoved.map(
          (p) => (p.id as CommunicationUserIdentifier).communicationUserId
        );
        if (removedParticipantIds.includes(userId)) {
          endChatHandler();
        }
      });
      adapter.setTopic('Your Chat sample');
      adapter.on('error', (e) => {
        console.error(e);
        errorHandler();
      });
      setAdapter(adapter);
      adapterRef.current = adapter;
    })();

    return () => {
      adapterRef?.current?.dispose();
    };
  }, [displayName, endpointUrl, threadId, token, userId, errorHandler, endChatHandler]);

  if (adapter) {
    const onFetchAvatarPersonaData = (userId): Promise<AvatarPersonaData> =>
      fetchEmojiForUser(userId).then(
        (emoji) =>
          new Promise((resolve) => {
            return resolve({
              imageInitials: emoji,
              initialsColor: getBackgroundColor(emoji)?.backgroundColor
            });
          })
      );

    return (
      <Stack className={chatScreenContainerStyle}>
        <Stack.Item className={chatHeaderContainerStyle}>
          <ChatHeader
            isParticipantsDisplayed={hideParticipants !== true}
            onEndChat={() => adapter.removeParticipant(userId)}
            setHideParticipants={setHideParticipants}
          />
        </Stack.Item>
        <Stack.Item className={chatCompositeContainerStyle}>
          <ChatComposite
            adapter={adapter}
            fluentTheme={currentTheme.theme}
            options={{ participantPane: !hideParticipants }}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          />
        </Stack.Item>
      </Stack>
    );
  }
  return <>Initializing...</>;
};
