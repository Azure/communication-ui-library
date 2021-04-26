// © Microsoft Corporation. All rights reserved.

import { chatThreadSelector, sendBoxSelector, typingIndicatorSelector } from '@azure/acs-chat-selector';
import { mergeStyles, Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { ErrorBar, MessageThread, SendBox, TypingIndicator } from '../../components';
import { useHandlers } from './hooks/useHandlers';
import { useSelector } from './hooks/useSelector';
import { chatContainer, chatWrapper } from './styles/GroupChat.styles';

export type ChatScreenProps = {
  threadId: string;
  sendBoxMaxLength?: number;
  onRenderAvatar?: (userId: string) => JSX.Element;
};

export const ChatScreen = (props: ChatScreenProps): JSX.Element => {
  const { threadId, onRenderAvatar, sendBoxMaxLength } = props;

  const pixelToRemConvertRatio = 16;
  const defaultNumberOfChatMessagesToReload = 5;
  const sendBoxParentStyle = mergeStyles({
    maxWidth: sendBoxMaxLength ? `${sendBoxMaxLength / pixelToRemConvertRatio}rem` : 'unset',
    width: '100%'
  });

  const selectorConfig = useMemo(() => {
    return { threadId };
  }, [threadId]);
  const sendBoxProps = useSelector(sendBoxSelector, selectorConfig);
  const sendBoxHandlers = useHandlers(SendBox);
  const typingIndicatorProps = useSelector(typingIndicatorSelector, selectorConfig);
  const chatThreadProps = useSelector(chatThreadSelector, selectorConfig);
  const chatThreadHandlers = useHandlers(MessageThread);

  return (
    <Stack className={chatContainer} grow>
      <Stack className={chatWrapper} grow>
        <MessageThread
          {...chatThreadProps}
          {...chatThreadHandlers}
          onRenderAvatar={onRenderAvatar}
          numberOfChatMessagesToReload={defaultNumberOfChatMessagesToReload}
        />
        <Stack.Item align="center" className={sendBoxParentStyle}>
          <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
            <TypingIndicator {...typingIndicatorProps} />
          </div>
          <ErrorBar />
          <SendBox {...sendBoxProps} {...sendBoxHandlers} />
        </Stack.Item>
      </Stack>
    </Stack>
  );
};
