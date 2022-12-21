// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { useSelector, getChatSelector, ChatClientState, useChatThreadClient } from '@azure/communication-react';
import { Message } from '@azure/communication-react';
import { MessageThread } from '@azure/communication-react';
import React, { useEffect } from 'react';

const customMessageContainerStyle = {
  height: '4rem',
  OverflowY: 'scroll',
  border: 'solid 2px'
};

const CustomChatThread = ({ messages }: { messages: Message[] }): JSX.Element => {
  return (
    <>
      {messages.map((message) =>
        message.messageType === 'chat' ? (
          <div key={message.messageId}>
            {message.senderDisplayName}: {message.content}
          </div>
        ) : undefined
      )}
    </>
  );
};

// Selector is a function that takes in ChatClientState or CallClientState then select the property you need
// We strongly recommend to use reselect library for getting better perf
// For how to write an efficient selector, check /docs/architecture/WritingSelectors.md
const topicSelector = (state: ChatClientState, props: { threadId: string }): string | undefined =>
  state.threads[props.threadId].properties?.topic;

export const UseSelectorExample = (): JSX.Element => {
  const chatThreadClient = useChatThreadClient();
  const threadId = chatThreadClient.threadId;

  // Messages and topic won't automatically show up until listMessages() gets called (it is handled in our MessageThread component)
  // State in stateful client only stores the history of previous function call results
  useEffect(() => {
    (async () => {
      // eslint-disable-next-line curly
      for await (const _ of chatThreadClient.listMessages());
      chatThreadClient.getProperties();
    })();
  }, [chatThreadClient]);

  const topic = useSelector(topicSelector, { threadId }) ?? '';

  // This will return the same data structure for our MessageThread component
  const messageThreadProps = useSelector(getChatSelector(MessageThread));
  return (
    <>
      <h5>Customized Message Component:</h5>
      <div> Topic Name: {topic} </div>
      <div style={customMessageContainerStyle}>
        <CustomChatThread messages={messageThreadProps.messages} />
      </div>
    </>
  );
};
