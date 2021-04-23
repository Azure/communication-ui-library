// © Microsoft Corporation. All rights reserved.

import {
  ErrorBar as ErrorBarComponent,
  SendBox,
  TypingIndicator,
  MessageThread,
  connectFuncsToContext,
  MapToErrorBarProps
} from '@azure/communication-ui';
import { useHandlers } from './hooks/useHandlers';
import { Stack } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';
import { getSelector, useProps } from './hooks/useProps';
import { useSelector } from './hooks/useSelector';

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

  // This could be option 1 of get a selector for a component without knowing the selector name
  const chatThreadProps = useSelector(getSelector(MessageThread));
  const chatThreadHandlers = useHandlers(MessageThread);
  // Option2
  const sendBoxProps = useProps(SendBox);
  const sendBoxHandlers = useHandlers(SendBox);
  const typingIndicatorProps = useProps(TypingIndicator);

  // Initialize the Chat thread with history messages
  useEffect(() => {
    (async () => {
      await chatThreadHandlers.onLoadPreviousChatMessages(5);
    })();
  }, [chatThreadHandlers]);

  return (
    <Stack className={chatAreaContainerStyle}>
      <MessageThread
        {...chatThreadProps}
        {...chatThreadHandlers}
        onRenderAvatar={props.onRenderAvatar}
        numberOfChatMessagesToReload={5}
      />
      <Stack.Item align="center" className={sendBoxParentStyle}>
        <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
          <TypingIndicator {...typingIndicatorProps} />
        </div>
        <ErrorBar />
        <SendBox {...sendBoxProps} {...sendBoxHandlers} />
      </Stack.Item>
    </Stack>
  );
};
