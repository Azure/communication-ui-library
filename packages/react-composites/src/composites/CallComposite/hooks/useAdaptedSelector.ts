// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useState, useEffect, useRef, useMemo } from 'react';

import memoizeOne from 'memoize-one';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallStatus } from '../adapter/CallAdapter';
import { Call, CallClientState, DeviceManagerState } from 'calling-stateful-client';

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
  AdaptFuncT extends (state: CallStatus) => any
>(
  selector: SelectorT,
  adaptState: AdaptFuncT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const adapter = useAdapter();

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
    const onStateChange = (state: CallStatus): void => {
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
    userId: string,
    deviceManager: DeviceManagerState,
    calls: Map<string, Call>,
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
  (call?: Call): Map<string, Call> => (call ? new Map([[call.id, call]]) : new Map([]))
);

const adaptCompositeState = (compositeState: CallStatus): CallClientState => {
  const call = compositeState.call;
  const callMap = memoizeCallMap(call);
  return memoizeState(compositeState.userId, compositeState.devices, callMap, compositeState.displayName);
};
