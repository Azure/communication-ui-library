// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatThreadClientState } from '@azure/acs-chat-declarative';
import { useState, useEffect, useRef, useMemo } from 'react';
import { GroupChatState } from '../adapter/GroupChatAdapter';
import { useAdapter } from '../adapter/GroupChatAdapterProvider';
import memoizeOne from 'memoize-one';
import { CommunicationIdentifierKind } from '@azure/communication-signaling';

// This function highly depends on chatClient.onChange event
// It will be moved into selector folder when the ChatClientProvide when refactor finished
export const useAdaptedSelector = <SelectorT extends (state: ChatClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  return useSelectorWithAdaptation(selector, adaptCompositeState, selectorProps);
};

export const useSelectorWithAdaptation = <
  SelectorT extends (state: ReturnType<AdaptFuncT>, props: any) => any,
  AdaptFuncT extends (state: GroupChatState) => any
>(
  selector: SelectorT,
  adaptState: AdaptFuncT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const adapter = useAdapter();

  const threadId = adapter.getState().thread.threadId;
  const threadConfigProps = useMemo(
    () => ({
      threadId
    }),
    [threadId]
  );

  const [props, setProps] = useState(selector(adaptState(adapter.getState()), selectorProps ?? threadConfigProps));
  const propRef = useRef(props);
  propRef.current = props;

  useEffect(() => {
    const onStateChange = (state: GroupChatState): void => {
      const newProps = selector(adaptState(state), selectorProps ?? threadConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    adapter.onStateChange(onStateChange);
    return () => {
      adapter.offStateChange(onStateChange);
    };
  }, [adaptState, adapter, selector, selectorProps, threadConfigProps]);
  return props;
};

const memoizeState = memoizeOne(
  (userId: CommunicationIdentifierKind, displayName: string, threads: Map<string, ChatThreadClientState>) => ({
    userId,
    displayName,
    threads
  })
);

const memoizeThreadMap = memoizeOne((thread: ChatThreadClientState) => new Map([[thread.threadId, thread]]));

const adaptCompositeState = (compositeState: GroupChatState): ChatClientState => {
  const thread = compositeState.thread;
  const threadMap = memoizeThreadMap(thread);
  return memoizeState(
    { kind: 'communicationUser', communicationUserId: compositeState.userId },
    compositeState.displayName,
    threadMap
  );
};
