// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CallClientState, StatefulCallClient } from '@internal/calling-stateful-client';
import { CallClientContext, CallContext } from '../providers';

import { useState, useEffect, useRef, useMemo, useContext } from 'react';

/**
 * Hook to obtain a selector for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useSelector = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  SelectorT extends (state: CallClientState, props: any) => any,
  ParamT extends SelectorT | undefined
>(
  selector: ParamT,
  selectorProps?: Parameters<SelectorT>[1]
): ParamT extends SelectorT ? ReturnType<SelectorT> : undefined => {
  const callClient: StatefulCallClient | undefined = useContext(CallClientContext)?.callClient;
  const callId = useContext(CallContext)?.call?.id;

  // Keeps track of whether the current component is mounted or not. If it has unmounted, make sure we do not modify the
  // state or it will cause React warnings in the console. https://skype.visualstudio.com/SPOOL/_workitems/edit/2453212
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  const callIdConfigProps = useMemo(
    () => ({
      callId
    }),
    [callId]
  );

  const [props, setProps] = useState(
    callClient && selector ? selector(callClient.getState(), selectorProps ?? callIdConfigProps) : undefined
  );
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    if (!callClient || !selector) {
      return;
    }
    const onStateChange = (state: CallClientState): void => {
      if (!mounted.current) {
        return;
      }
      const newProps = selector(state, selectorProps ?? callIdConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    callClient.onStateChange(onStateChange);
    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [callClient, selector, selectorProps, callIdConfigProps, mounted]);
  return selector ? props : undefined;
};
