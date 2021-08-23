// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier, CommunicationUserKind } from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { PrimaryButton, Stack } from '@fluentui/react';
import React, { useEffect, useRef, useState } from 'react';

import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';
// import { onRenderAvatar } from './Avatar';

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
  const { currentTheme } = useSwitchableFluentTheme();

  useEffect(() => {
    (async () => {
      const userIdKind = { kind: 'communicationUser', communicationUserId: userId } as CommunicationUserKind;
      const adapter = await createAzureCommunicationChatAdapter({
        endpointUrl: endpointUrl,
        userId: userIdKind,
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
          new Promise((resolve, reject) => {
            return resolve({
              imageInitials: emoji,
              initialsColor: getBackgroundColor(emoji)?.backgroundColor
            });
          })
      );

    return (
      <Stack style={{ height: '100%', width: '100%' }}>
        <PrimaryButton
          id="endChat"
          text="Leave Chat"
          aria-label="Leave chat"
          onClick={() => {
            adapter.removeParticipant(userId);
          }}
          style={{ maxWidth: 'fit-content', alignSelf: 'flex-end' }}
        />
        <ChatComposite
          adapter={adapter}
          fluentTheme={currentTheme.theme}
          options={{ showParticipantPane: true, showTopic: true }}
          onFetchAvatarPersonaData={onFetchAvatarPersonaData}
        />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
