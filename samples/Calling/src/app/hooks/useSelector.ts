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
      const newProps = selector(state, selectorProps ?? callIdConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    callClient.onStateChange(onStateChange);
    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [callClient, selector, selectorProps, callIdConfigProps, callId]);
  return props;
};
