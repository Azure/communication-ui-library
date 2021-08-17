// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { usePropsFor, SendBox, TypingIndicator, MessageThread, OnRenderAvatarType } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React, { useEffect } from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';

export interface ChatAreaProps {
  onRenderAvatar?: OnRenderAvatarType;
}

export const ChatArea = (props: ChatAreaProps): JSX.Element => {
  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatArea is to become a component or if Sample App is to move to composite

  const chatThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);

  const onLoadPreviousChatMessages = chatThreadProps.onLoadPreviousChatMessages;

  // Initialize the Chat thread with history messages
  useEffect(() => {
    (async () => {
      await onLoadPreviousChatMessages(5);
    })();
  }, [onLoadPreviousChatMessages]);

  return (
    <Stack className={chatAreaContainerStyle}>
      <MessageThread {...chatThreadProps} onRenderAvatar={props.onRenderAvatar} numberOfChatMessagesToReload={5} />
      <Stack.Item align="center" className={sendBoxParentStyle}>
        <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
          <TypingIndicator {...typingIndicatorProps} />
        </div>
        <SendBox {...sendBoxProps} />
      </Stack.Item>
    </Stack>
  );
};
