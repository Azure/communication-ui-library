// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, StatefulChatClient } from '@internal/chat-stateful-client';
import { ChatClientContext } from '../providers/ChatClientProvider';

import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { ChatThreadClientContext } from '../providers/ChatThreadClientProvider';

/**
 * Hook to obtain a selector for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useSelector = <
  SelectorT extends (state: ChatClientState, props: any) => any,
  ParamT extends SelectorT | undefined
>(
  selector: ParamT,
  selectorProps?: Parameters<SelectorT>[1]
): ParamT extends SelectorT ? ReturnType<SelectorT> : undefined => {
  const chatClient: StatefulChatClient | undefined = useContext(ChatClientContext);
  const threadId = useContext(ChatThreadClientContext)?.threadId;

  // Keeps track of whether the current component is mounted or not. If it has unmounted, make sure we do not modify the
  // state or it will cause React warnings in the console. https://skype.visualstudio.com/SPOOL/_workitems/edit/2453212
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

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
