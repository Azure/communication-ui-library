// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatThreadClient } from '@azure/communication-chat';
import { ChatClientState, ChatErrors, ChatThreadClientState } from 'chat-stateful-client';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ChatAdapterErrors, ChatState } from '../adapter/ChatAdapter';
import { useAdapter } from '../adapter/ChatAdapterProvider';
import memoizeOne from 'memoize-one';
import { CommunicationIdentifierKind } from '@azure/communication-common';

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
  AdaptFuncT extends (state: ChatState) => any
>(
  selector: SelectorT,
  adaptState: AdaptFuncT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const adapter = useAdapter();

  // Keeps track of whether the current component is mounted or not. If it has unmounted, make sure we do not modify the
  // state or it will cause React warnings in the console. https://skype.visualstudio.com/SPOOL/_workitems/edit/2453212
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

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
    const onStateChange = (state: ChatState): void => {
      if (!mounted.current) {
        return;
      }
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
  (
    userId: CommunicationIdentifierKind,
    displayName: string,
    threads: { [key: string]: ChatThreadClientState },
    latestErrors: ChatErrors
  ) => ({
    userId,
    displayName,
    threads,
    latestErrors
  })
);

const memoizeThreads = memoizeOne((thread: ChatThreadClientState) => ({ [thread.threadId]: thread }));

const adaptCompositeState = (compositeState: ChatState): ChatClientState => {
  return memoizeState(
    { kind: 'communicationUser', communicationUserId: compositeState.userId },
    compositeState.displayName,
    memoizeThreads(compositeState.thread),
    // This is an unsafe type expansion.
    // compositeState.latestErrors can contain keys that are not valid keys in ChatErrors.
    //
    // But there is no way to check for valid keys at runtime:
    // - The set of valid keys is built from types in the @azure/communication-chat.
    //   Thus we don't have a literal array of allowed strings at runtime.
    // - Due to minification / uglification, the property names from the objects at runtime can't be used
    //   to compare against permissible values inferred from the types.
    //
    // This is not a huge problem -- this simply means that our adapted selector will include some extra operations
    // that are unknown to the bindings and component UI libraries. Generic UI processing of the errors (e.g.,
    // just displaying them in some UI surface) will continue to work for these operations. Special handling of
    // specific operations (e.g., acting on errors related to permission issues) will ignore these operations.
    compositeState.latestErrors as ChatErrors
  );
};
