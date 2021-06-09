// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, StatefulChatClient } from 'chat-stateful-client';
import { ChatClientContext } from '../providers/ChatClientProvider';

import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { ChatThreadClientContext } from '../providers/ChatThreadClientProvider';

// This function highly depends on chatClient.onChange event
// It will be moved into selector folder when the ChatClientProvide when refactor finished
export const useSelector = <
  SelectorT extends (state: ChatClientState, props: any) => any,
  ParamT extends SelectorT | undefined
>(
  selector: ParamT,
  selectorProps?: Parameters<SelectorT>[1]
): ParamT extends SelectorT ? ReturnType<SelectorT> : undefined => {
  const chatClient: StatefulChatClient | undefined = useContext(ChatClientContext);
  const threadId = useContext(ChatThreadClientContext)?.threadId;

  const threadConfigProps = useMemo(
    () => ({
      threadId
    }),
    [threadId]
  );

  const [props, setProps] = useState(
    chatClient && selector ? selector(chatClient.getState(), selectorProps ?? threadConfigProps) : undefined
  );
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    if (!chatClient || !selector) return;
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
  return selector ? props : undefined;
};
