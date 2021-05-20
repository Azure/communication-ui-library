// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, StatefulCallClient } from 'calling-stateful-client';
import { useCall, useCallClient } from 'react-composites';

import { useState, useEffect, useRef, useMemo } from 'react';

export const useSelector = <SelectorT extends (state: CallClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const callClient: StatefulCallClient = useCallClient() as any;
  const callId = useCall()?.id;

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

  const [props, setProps] = useState(selector(callClient.getState(), selectorProps ?? callIdConfigProps));
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
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
  return props;
};
