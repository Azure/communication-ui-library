// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { ChatHeader } from './ChatHeader';
import { chatCompositeContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';

import { Providers } from '@microsoft/mgt-element';
import { _useIsSignedIn } from '@internal/acs-ui-common';
import { createMicrosoftGraphChatAdapter } from './graph-adapter/MicrosoftGraphChatAdapter';

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  endChatHandler(isParticipantRemoved: boolean): void;
  errorHandler(): void;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { displayName, endpointUrl, endChatHandler } = props;

  const [isSignedIn] = _useIsSignedIn();
  const threadId = isSignedIn
    ? '19:08381377-19e1-48df-876d-a45998dd5910_71ad4812-19d8-4fd6-8ceb-0f14c2101e5e@unq.gbl.spaces'
    : props.threadId;
  const userId = isSignedIn ? '08381377-19e1-48df-876d-a45998dd5910' : props.userId;
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!isSignedIn) {
        setToken(props.token);
        return;
      }
      const providerCreatedToken = await Providers.globalProvider.getAccessToken();
      setToken(providerCreatedToken);
    })();
  }, []);

  const [hideParticipants, setHideParticipants] = useState<boolean>(false);
  const { currentTheme } = useSwitchableFluentTheme();

  const adapterAfterCreate = useCallback(
    async (adapter: ChatAdapter): Promise<ChatAdapter> => {
      adapter.on('participantsRemoved', (listener) => {
        // Note: We are receiving ChatParticipant.id from communication-signaling, so of type 'CommunicationIdentifierKind'
        // while it's supposed to be of type 'CommunicationIdentifier' as defined in communication-chat
        const removedParticipantIds = listener.participantsRemoved.map(
          (p) => (p.id as CommunicationUserIdentifier).communicationUserId
        );
        if (removedParticipantIds.includes(userId)) {
          const removedBy = (listener.removedBy.id as CommunicationUserIdentifier).communicationUserId;
          endChatHandler(removedBy !== userId);
        }
      });
      adapter.on('error', (e) => {
        console.error(e);
      });
      return adapter;
    },
    [endChatHandler, userId]
  );

  const adapterArgs = useMemo(
    () =>
      token
        ? {
            endpoint: endpointUrl,
            userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
            displayName,
            credential: createAutoRefreshingCredential(userId, token),
            threadId
          }
        : undefined,
    [endpointUrl, userId, displayName, token, threadId]
  );
  // const adapter = useAzureCommunicationChatAdapter(adapterArgs ?? {}, adapterAfterCreate);

  const [adapter, setAdapter] = useState<ChatAdapter | undefined>();
  useEffect(() => {
    (async () => {
      const graphAdapter = await createMicrosoftGraphChatAdapter();
      console.log('graphAdapter:', graphAdapter);
      setAdapter(graphAdapter);
    })();
  }, []);

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
        <Stack.Item className={chatCompositeContainerStyle}>
          <ChatComposite
            adapter={adapter}
            fluentTheme={currentTheme.theme}
            options={{ autoFocus: 'sendBoxTextField', participantPane: !hideParticipants }}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          />
        </Stack.Item>
        <ChatHeader
          isParticipantsDisplayed={hideParticipants !== true}
          onEndChat={() => adapter.removeParticipant(userId)}
          setHideParticipants={setHideParticipants}
        />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
