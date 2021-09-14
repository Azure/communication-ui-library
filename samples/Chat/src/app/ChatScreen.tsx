// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier, CommunicationUserKind } from '@azure/communication-common';
import {
  PersonalData,
  ChatAdapter,
  ChatComposite,
  createAzureCommunicationChatAdapter
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
  const [showParticipants, setShowParticipants] = useState<boolean>(true);
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
    const onFetchPersonalData = (userId): Promise<PersonalData> =>
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
      <Stack className={chatScreenContainerStyle}>
        <Stack.Item className={chatHeaderContainerStyle}>
          <ChatHeader
            isParticipantsDisplayed={showParticipants}
            onEndChat={() => adapter.removeParticipant(userId)}
            setShowParticipants={setShowParticipants}
          />
        </Stack.Item>
        <Stack.Item className={chatCompositeContainerStyle}>
          <ChatComposite
            adapter={adapter}
            fluentTheme={currentTheme.theme}
            visualElements={{ showParticipantPane: showParticipants, showTopic: true, showErrorBar: true }}
            onFetchPersonalData={onFetchPersonalData}
          />
        </Stack.Item>
      </Stack>
    );
  }
  return <>Initializing...</>;
};
