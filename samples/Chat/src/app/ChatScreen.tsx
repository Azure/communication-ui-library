// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  AvatarPersonaData,
  ChatAdapter,
  ChatComposite,
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  useAzureCommunicationChatAdapter
} from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo } from 'react';
/* @conditional-compile-remove(chat-composite-participant-pane) */
import { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { chatCompositeContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentUploadOptions } from './utils/uploadHandler';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentDownloadOptions } from './utils/downloadHandler';

// These props are passed in when this component is referenced in JSX and not found in context
interface ChatScreenProps {
  token: string;
  userId: string;
  displayName: string;
  endpointUrl: string;
  threadId: string;
  endChatHandler(isParticipantRemoved: boolean): void;
  /* @conditional-compile-remove(rich-text-editor-composite-support) */
  isRichTextEditorEnabled: boolean;
}

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const {
    displayName,
    endpointUrl,
    threadId,
    token,
    userId,
    endChatHandler,
    /* @conditional-compile-remove(rich-text-editor-composite-support) */ isRichTextEditorEnabled
  } = props;

  // Disables pull down to refresh. Prevents accidental page refresh when scrolling through chat messages
  // Another alternative: set body style touch-action to 'none'. Achieves same result.
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'null';
    };
  }, []);

  /* @conditional-compile-remove(chat-composite-participant-pane) */
  const [hideParticipants, setHideParticipants] = useState<boolean>(true);

  const { currentTheme } = useSwitchableFluentTheme();

  const adapterAfterCreate = useCallback(
    async (adapter: ChatAdapter): Promise<ChatAdapter> => {
      adapter.on('participantsRemoved', (listener) => {
        const removedParticipantIds = listener.participantsRemoved.map((p) => toFlatCommunicationIdentifier(p.id));
        if (removedParticipantIds.includes(userId)) {
          const removedBy = toFlatCommunicationIdentifier(listener.removedBy.id);
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
    () => ({
      endpoint: endpointUrl,
      userId: fromFlatCommunicationIdentifier(userId) as CommunicationUserIdentifier,
      displayName,
      credential: createAutoRefreshingCredential(userId, token),
      threadId
    }),
    [endpointUrl, userId, displayName, token, threadId]
  );
  const adapter = useAzureCommunicationChatAdapter(adapterArgs, adapterAfterCreate);

  // Dispose of the adapter in the window's before unload event
  useEffect(() => {
    const disposeAdapter = (): void => adapter?.dispose();
    window.addEventListener('beforeunload', disposeAdapter);
    return () => window.removeEventListener('beforeunload', disposeAdapter);
  }, [adapter]);

  if (adapter) {
    const onFetchAvatarPersonaData = (userId: string): Promise<AvatarPersonaData> =>
      fetchEmojiForUser(userId).then(
        (emoji) =>
          new Promise((resolve) => {
            return resolve({
              imageInitials: emoji,
              initialsColor: emoji ? getBackgroundColor(emoji)?.backgroundColor : undefined,
              hideAvatar: true
            });
          })
      );
    return (
      <Stack className={chatScreenContainerStyle}>
        <Stack.Item className={chatCompositeContainerStyle} role="main">
          <ChatComposite
            adapter={adapter}
            fluentTheme={currentTheme.theme}
            options={{
              autoFocus: 'sendBoxTextField',
              /* @conditional-compile-remove(chat-composite-participant-pane) */
              participantPane: !hideParticipants,
              /* @conditional-compile-remove(file-sharing-acs) */
              attachmentOptions: {
                uploadOptions: attachmentUploadOptions,
                downloadOptions: attachmentDownloadOptions
              },
              /* @conditional-compile-remove(rich-text-editor-composite-support) */
              richTextEditor: isRichTextEditorEnabled
            }}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
          />
        </Stack.Item>
        <ChatHeader
          /* @conditional-compile-remove(chat-composite-participant-pane) */
          isParticipantsDisplayed={hideParticipants !== true}
          onEndChat={() => adapter.removeParticipant(userId)}
          /* @conditional-compile-remove(chat-composite-participant-pane) */
          setHideParticipants={setHideParticipants}
        />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
