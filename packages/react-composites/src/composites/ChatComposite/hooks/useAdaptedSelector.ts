// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClientState, ChatErrors, ChatThreadClientState, isChatErrorTarget } from 'chat-stateful-client';
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

const memoizeErrors = memoizeOne((errors: ChatAdapterErrors) => toStatefulErrors(errors));

const toStatefulErrors = (errors: ChatAdapterErrors): ChatErrors => {
  return Object.fromEntries(Object.entries(errors).filter(([key, _]) => isChatErrorTarget(key))) as ChatErrors;
};

const memoizeThreads = memoizeOne((thread: ChatThreadClientState) => ({ [thread.threadId]: thread }));

const adaptCompositeState = (compositeState: ChatState): ChatClientState => {
  return memoizeState(
    { kind: 'communicationUser', communicationUserId: compositeState.userId },
    compositeState.displayName,
    memoizeThreads(compositeState.thread),
    memoizeErrors(compositeState.latestErrors)
  );
};
