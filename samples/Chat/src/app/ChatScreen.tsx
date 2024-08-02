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
import { Text, IconButton, keyframes, Spinner, Stack, useTheme, mergeStyles } from '@fluentui/react';
import React, { useCallback, useEffect, useMemo } from 'react';
/* @conditional-compile-remove(chat-composite-participant-pane) */
import { useState } from 'react';
import { ChatHeader, CopilotResponse } from './ChatHeader';
import { chatCompositeContainerStyle, chatScreenContainerStyle } from './styles/ChatScreen.styles';
import { createAutoRefreshingCredential } from './utils/credential';
import { fetchEmojiForUser } from './utils/emojiCache';
import { getBackgroundColor } from './utils/utils';
import { useSwitchableFluentTheme } from './theming/SwitchableFluentThemeProvider';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentUploadOptions } from './utils/uploadHandler';
/* @conditional-compile-remove(file-sharing-acs) */
import { attachmentDownloadOptions } from './utils/downloadHandler';
import CursorSVG from '../assets/cursor.svg';
import copilotIcon from '../assets/copilot.svg';
import { leaveIconStyle } from './styles/ChatHeader.styles';

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
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const [completedTyping, setCompletedTyping] = useState<boolean>(false);
  const [displayResponse, setDisplayResponse] = useState<string>('');
  const [copilotResponse, setCopilotResponse] = useState<[CopilotResponse]>([
    {
      content: ''
    }
  ]);
  const { currentTheme } = useSwitchableFluentTheme();
  const theme = useTheme();

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

  // credit: https://dev.to/stiaanwol/how-to-build-the-chatgpt-typing-animation-in-react-2cca
  useEffect(() => {
    setCompletedTyping(false);
    let i = 0;
    const stringResponse = copilotResponse[copilotResponse.length - 1].content;
    const intervalId = setInterval(() => {
      setDisplayResponse(stringResponse.slice(0, i));
      i++;
      if (i > stringResponse.length) {
        clearInterval(intervalId);
        setCompletedTyping(true);
      }
    }, 20);
    return () => clearInterval(intervalId);
  }, [copilotResponse]);

  const flicker = keyframes({
    from: { opacity: '0%' },
    to: { opacity: '100%' }
  });
  if (adapter) {
    const onFetchAvatarPersonaData = (userId: string): Promise<AvatarPersonaData> =>
      fetchEmojiForUser(userId).then(
        (emoji) =>
          new Promise((resolve) => {
            return resolve({
              imageInitials: emoji,
              initialsColor: emoji ? getBackgroundColor(emoji)?.backgroundColor : undefined
            });
          })
      );
    return (
      <Stack className={chatScreenContainerStyle}>
        <Stack.Item className={chatCompositeContainerStyle} role="main">
          {showNotification ? (
            <div style={{ display: 'block', position: 'absolute', zIndex: '10', right: '0', top: '50px' }}>
              <span
                style={{
                  display: 'block',
                  position: 'absolute',
                  zIndex: '10',
                  top: '10px',
                  right: '10px',
                  boxShadow: theme.effects.elevation8,
                  width: '20rem',
                  height: 'auto',
                  padding: '0.75rem',
                  borderRadius: '0.25rem',
                  backgroundColor: theme.palette.white,
                  wordWrap: 'break-word',
                  overflow: 'visible',
                  whiteSpace: 'pre-wrap'
                }}
              >
                <Stack horizontal horizontalAlign="space-between">
                  <Stack horizontal>
                    <img
                      src={copilotIcon.toString()}
                      className={mergeStyles([leaveIconStyle, { width: '20px', height: 'auto' }])}
                    />
                    <Text style={{ fontWeight: '800', paddingTop: '5px' }}>{'Copilot'}</Text>
                  </Stack>

                  <IconButton
                    iconProps={{
                      iconName: 'cancel'
                    }}
                    ariaLabel={'dismiss'}
                    aria-live={'polite'}
                    onClick={() => setShowNotification(false)}
                  />
                </Stack>
                {displayResponse}
                {!completedTyping && (
                  <img
                    src={CursorSVG.toString()}
                    style={{
                      display: 'inline-block',
                      width: '1ch',
                      animation: `${flicker} 0.5s infinite`,
                      verticalAlign: 'bottom',
                      filter:
                        'brightness(0) saturate(100%) invert(23%) sepia(18%) saturate(7%) hue-rotate(9deg) brightness(89%) contrast(88%)'
                    }}
                  />
                )}
              </span>
            </div>
          ) : (
            <></>
          )}

          {showLoading ? (
            <div
              style={{
                display: 'block',
                position: 'absolute',
                zIndex: '10',
                right: '10px',
                top: '60px',
                boxShadow: theme.effects.elevation8,
                width: '20rem',
                padding: '0.75rem',
                borderRadius: '0.25rem',
                backgroundColor: theme.palette.white
              }}
            >
              <Spinner label="Analyzing conversations..." />
            </div>
          ) : (
            <></>
          )}
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
          setNotification={setShowNotification}
          setLoading={setShowLoading}
          setResponse={setCopilotResponse}
        />
      </Stack>
    );
  }
  return <>Initializing...</>;
};
