// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useRef, useMemo } from 'react';

import memoizeOne from 'memoize-one';
import { useAdapter } from '../adapter/CallAdapterProvider';
import { CallAdapterState } from '../adapter/CallAdapter';
import {
  CallErrors,
  CallState,
  CallClientState,
  DeviceManagerState,
  IncomingCallState
} from '@internal/calling-stateful-client';
import { CommunicationIdentifierKind } from '@azure/communication-common';
/* @conditional-compile-remove(unsupported-browser) */
import { EnvironmentInfo } from '@azure/communication-calling';
/**
 * @private
 */
export const useAdaptedSelector = <SelectorT extends (state: CallClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  return useSelectorWithAdaptation(selector, adaptCompositeState, selectorProps);
};

/**
 * @private
 */
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
    userId: CommunicationIdentifierKind,
    deviceManager: DeviceManagerState,
    calls: { [key: string]: CallState },
    incomingCalls: {
      [key: string]: IncomingCallState;
    },
    latestErrors: CallErrors,
    displayName?: string,
    alternateCallerId?: string,
    environmentInfo?: undefined | /* @conditional-compile-remove(unsupported-browser) */ EnvironmentInfo
  ): CallClientState => ({
    userId,
    incomingCalls: incomingCalls,
    incomingCallsEnded: {},
    callsEnded: {},
    deviceManager,
    callAgent: { displayName },
    calls,
    latestErrors,
    /* @conditional-compile-remove(PSTN-calls) */
    alternateCallerId,
    /* @conditional-compile-remove(unsupported-browser) */
    environmentInfo
  })
);

const memoizeCalls = memoizeOne((call?: CallState): { [key: string]: CallState } => (call ? { [call.id]: call } : {}));

const adaptCompositeState = (compositeState: CallAdapterState): CallClientState => {
  return memoizeState(
    compositeState.userId,
    compositeState.devices,
    memoizeCalls(compositeState.call),
    compositeState.incomingCalls,
    // This is an unsafe type expansion.
    // compositeState.latestErrors can contain properties that are not valid in CallErrors.
    //
    // But there is no way to check for valid property names at runtime:
    // - The set of valid property names is built from types in the @azure/communication-calling.
    //   Thus we don't have a literal array of allowed strings at runtime.
    // - Due to minification / uglification, the property names from the objects at runtime can't be used
    //   to compare against permissible values inferred from the types.
    //
    // This is not a huge problem -- it simply means that our adapted selector will include some extra operations
    // that are unknown to the UI component and data binding libraries. Generic handling of the errors (e.g.,
    // just displaying them in some UI surface) will continue to work for these operations. Handling of
    // specific operations (e.g., acting on errors related to permission issues) will ignore these operations.
    compositeState.latestErrors as CallErrors,
    compositeState.displayName,
    /* @conditional-compile-remove(PSTN-calls) */
    compositeState.alternateCallerId,
    /* @conditional-compile-remove(unsupported-browser) */
    compositeState.environmentInfo
  );
};
