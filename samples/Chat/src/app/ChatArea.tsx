// © Microsoft Corporation. All rights reserved.

import { ErrorBar as ErrorBarComponent, SendBox, TypingIndicator, MessageThread } from 'react-components';
import { connectFuncsToContext, MapToErrorBarProps } from 'react-composites';
import { Stack } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';
import { usePropsFor } from '@azure/acs-chat-selector';

export interface ChatAreaProps {
  onRenderAvatar?: (userId: string) => JSX.Element;
}

export const ChatArea = (props: ChatAreaProps): JSX.Element => {
  const ErrorBar = useMemo(() => {
    return connectFuncsToContext(ErrorBarComponent, MapToErrorBarProps);
  }, []);

  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatArea is to become a component or if Sample App is to move to composite

  const chatThreadProps = usePropsFor(MessageThread);
  const sendBoxProps = usePropsFor(SendBox);
  const typingIndicatorProps = usePropsFor(TypingIndicator);

  const onLoadPreviousChatMessages = chatThreadProps.onLoadPreviousChatMessages;

  // This state is a temporary contoso fix and will be the typingUsers prop passed to TypingIndicator
  const [transientTypingUsers, setTransientTypingUsers] = useState(typingIndicatorProps.typingUsers);
  // This useEffect is to set transientTypingUsers to be empty after a timeout of no updates from usePropsFor
  useEffect(() => {
    setTransientTypingUsers(typingIndicatorProps.typingUsers);
    setTimeout(() => {
      setTransientTypingUsers([]);
    }, 8000); //wait 8000 milliseconds to make sure it cleans up well
  }, [typingIndicatorProps.typingUsers]);

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
          <TypingIndicator typingUsers={transientTypingUsers} />
        </div>
        <ErrorBar />
        <SendBox {...sendBoxProps} />
      </Stack.Item>
    </Stack>
  );
};
