// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { useChatClient, useThreadId } from 'react-composites';

import { useState, useEffect, useRef, useMemo } from 'react';

// This function highly depends on chatClient.onChange event
// It will be moved into selector folder when the ChatClientProvide when refactor finished
export const useSelector = <SelectorT extends (state: ChatClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const chatClient: DeclarativeChatClient = useChatClient() as any;
  const threadId = useThreadId();

  const threadConfigProps = useMemo(
    () => ({
      threadId
    }),
    [threadId]
  );

  const [props, setProps] = useState(selector(chatClient.state, selectorProps ?? threadConfigProps));
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
