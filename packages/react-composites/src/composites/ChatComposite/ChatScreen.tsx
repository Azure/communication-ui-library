// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { ErrorBar, MessageThread, SendBox, TypingIndicator } from 'react-components';
import { useAdapter } from './adapter/ChatAdapterProvider';
import { usePropsFor } from './hooks/usePropsFor';
import { chatContainer, chatWrapper } from './styles/Chat.styles';

export type ChatScreenProps = {
  sendBoxMaxLength?: number;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { onRenderAvatar, sendBoxMaxLength } = props;

  const pixelToRemConvertRatio = 16;
  const defaultNumberOfChatMessagesToReload = 5;
  const sendBoxParentStyle = mergeStyles({
    maxWidth: sendBoxMaxLength ? `${sendBoxMaxLength / pixelToRemConvertRatio}rem` : 'unset',
    width: '100%'
  });

  const adapter = useAdapter();

  // This code gets all participants who joined the chat earlier than the current user.
  // We need to do this to update the adapter's state.
  useEffect(() => {
    adapter.updateAllParticipants();
  }, [adapter]);

  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);
  const messageThreadProps = usePropsFor(MessageThread);

  return (
    <Stack className={chatContainer} grow>
      <Stack className={chatWrapper} grow>
        <MessageThread
          {...messageThreadProps}
          onRenderAvatar={onRenderAvatar}
          numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
        />
        <Stack.Item align="center" className={sendBoxParentStyle}>
          <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
            <TypingIndicator {...typingIndicatorProps} />
          </div>
          <ErrorBar />
          <SendBox {...sendBoxProps} />
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
