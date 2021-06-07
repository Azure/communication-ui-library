// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState, useEffect, useRef, useMemo } from 'react';

import memoizeOne from 'memoize-one';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallAdapterState } from '../adapter/CallAdapter';
import { CallState, CallClientState, DeviceManagerState } from 'calling-stateful-client';
import { CommunicationUserKind } from '@azure/communication-common';

// This function highly depends on chatClient.onChange event
// It will be moved into selector folder when the ChatClientProvide when refactor finished
export const useAdaptedSelector = <SelectorT extends (state: CallClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  return useSelectorWithAdaptation(selector, adaptCompositeState, selectorProps);
};

export const useSelectorWithAdaptation = <
  SelectorT extends (state: ReturnType<AdaptFuncT>, props: any) => any,
  AdaptFuncT extends (state: CallAdapterState) => any
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

  const callId = adapter.getState().call?.id;
  const callConfigProps = useMemo(
    () => ({
      callId
    }),
    [callId]
  );

  const [props, setProps] = useState(selector(adaptState(adapter.getState()), selectorProps ?? callConfigProps));
  const propRef = useRef(props);
  propRef.current = props;

  useEffect(() => {
    const onStateChange = (state: CallAdapterState): void => {
      if (!mounted.current) {
        return;
      }
      const newProps = selector(adaptState(state), selectorProps ?? callConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    adapter.onStateChange(onStateChange);
    return () => {
      adapter.offStateChange(onStateChange);
    };
  }, [adaptState, adapter, selector, selectorProps, callConfigProps]);
  return props;
};

const memoizeState = memoizeOne(
  (
    userId: CommunicationUserKind,
    deviceManager: DeviceManagerState,
    calls: Map<string, CallState>,
    displayName?: string
  ): CallClientState => ({
    userId,
    incomingCalls: new Map([]),
    incomingCallsEnded: [],
    callsEnded: [],
    deviceManager,
    callAgent: { displayName },
    calls
  })
);

const memoizeCallMap = memoizeOne(
  (call?: CallState): Map<string, CallState> => (call ? new Map([[call.id, call]]) : new Map([]))
);

const adaptCompositeState = (compositeState: CallAdapterState): CallClientState => {
  const call = compositeState.call;
  const callMap = memoizeCallMap(call);
  return memoizeState(compositeState.userId, compositeState.devices, callMap, compositeState.displayName);
};
