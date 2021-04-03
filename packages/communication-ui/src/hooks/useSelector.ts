// © Microsoft Corporation. All rights reserved.

import { ChatClientState, DeclarativeChatClient } from '@azure/acs-chat-declarative';
import { useChatClient } from '../providers';

import { useState, useEffect, useRef } from 'react';

// This function highly depends on chatClient.onChange event
// It will be moved into selector folder with a ChatClientProvide when refactor finished
export const useSelector = <SelectorT extends (state: ChatClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const chatClient: DeclarativeChatClient = useChatClient() as any;
  const [props, setProps] = useState(selector(chatClient.state, selectorProps));
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    const onStateChange = (state: ChatClientState): void => {
      const newProps = selector(state, selectorProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    chatClient.onStateChange(onStateChange);
    return () => {
      chatClient.unsubscribeStateChange(onStateChange);
    };
  }, [chatClient, selector, selectorProps]);
  return props;
};
