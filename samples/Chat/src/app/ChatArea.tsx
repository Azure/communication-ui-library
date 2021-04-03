// © Microsoft Corporation. All rights reserved.

import { ErrorBar, SendBox, TypingIndicator, ChatThreadComponentBase, useThreadId } from '@azure/communication-ui';
import { useHandlers } from './hooks/useHandlers';
import { chatThreadSelector } from '@azure/acs-chat-selector';
import { Stack } from '@fluentui/react';
import React, { useMemo } from 'react';
import { chatAreaContainerStyle, sendBoxParentStyle } from './styles/ChatArea.styles';
import { useSelector } from './hooks/useSelector';

export interface ChatAreaProps {
  onRenderAvatar?: (userId: string) => JSX.Element;
}

export const ChatArea = (props: ChatAreaProps): JSX.Element => {
  // onRenderAvatar is a contoso callback. We need it to support emoji in Sample App. Sample App is currently on
  // components v0 so we're passing the callback at the component level. This might need further refactoring if this
  // ChatArea is to become a component or if Sample App is to move to composite
  const threadId = useThreadId();

  const selectorConfig = useMemo(() => {
    return { threadId };
  }, [threadId]);

  const chatThreadProps = useSelector(chatThreadSelector, selectorConfig);
  const handlers = useHandlers(ChatThreadComponentBase);
  return (
    <Stack className={chatAreaContainerStyle}>
      <ChatThreadComponentBase {...chatThreadProps} {...handlers} onRenderAvatar={props.onRenderAvatar} />
      <Stack.Item align="center" className={sendBoxParentStyle}>
        <div style={{ paddingLeft: '0.5rem', paddingRight: '0.5rem' }}>
          <TypingIndicator />
        </div>
        <ErrorBar />
        <SendBox />
      </Stack.Item>
    </Stack>
  );
};
