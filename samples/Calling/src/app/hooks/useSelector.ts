// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallClientState, DeclarativeCallClient } from '@azure/acs-calling-declarative';
import { useCall, useCallClient, useDisplayName, useIdentifier } from 'react-composites';

import { useState, useEffect, useRef, useMemo } from 'react';

export const useSelector = <SelectorT extends (state: CallClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps?: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const callClient: DeclarativeCallClient = useCallClient() as any;
  const callId = useCall()?.id;
  const displayName = useDisplayName();
  const identifier = useIdentifier();

  const callIdConfigProps = useMemo(
    () => ({
      callId,
      displayName,
      identifier
    }),
    [callId, displayName, identifier]
  );

  const [props, setProps] = useState(selector(callClient.state, selectorProps ?? callIdConfigProps));
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    const onStateChange = (state: CallClientState): void => {
      const newProps = selector(state, selectorProps ?? callIdConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
        if (callId) {
          state.calls.get(callId)?.remoteParticipants.forEach((p) => {
            console.log('Setting State', p.identifier, p.state);
          });
        }
      }
    };
    callClient.onStateChange(onStateChange);
    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [callClient, selector, selectorProps, callIdConfigProps, callId]);
  return props;
};
