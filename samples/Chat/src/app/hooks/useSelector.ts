// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, StatefulChatClient } from 'chat-stateful-client';
import { useChatClient, useChatThreadClient } from '@azure/communication-react';
import { useState, useEffect, useRef, useMemo } from 'react';

export const useSelector = <SelectorT extends (state: ChatClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const chatClient: StatefulChatClient = useChatClient() as any;
  const threadId = useChatThreadClient().threadId;

  const threadConfigProps = useMemo(
    () => ({
      threadId
    }),
    [threadId]
  );

  const [props, setProps] = useState(selector(chatClient.getState(), selectorProps ?? threadConfigProps));
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    const onStateChange = (state: ChatClientState): void => {
      const newProps = selector(state, selectorProps ?? threadConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    chatClient.onStateChange(onStateChange);
    return () => {
      chatClient.offStateChange(onStateChange);
    };
  }, [chatClient, selector, selectorProps, threadConfigProps]);
  return props;
};
