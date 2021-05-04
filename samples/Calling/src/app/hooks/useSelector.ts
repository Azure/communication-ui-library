// © Microsoft Corporation. All rights reserved.

import { CallClientState, DeclarativeCallClient } from '@azure/acs-calling-declarative';
import { useCallClient } from '@azure/react-components';

import { useState, useEffect, useRef } from 'react';

export const useSelector = <SelectorT extends (state: CallClientState, props: any) => any>(
  selector: SelectorT,
  selectorProps: Parameters<SelectorT>[1]
): ReturnType<SelectorT> => {
  const callClient: DeclarativeCallClient = useCallClient() as any;
  const [props, setProps] = useState(selector(callClient.state, selectorProps));
  const propRef = useRef(props);
  propRef.current = props;
  useEffect(() => {
    const onStateChange = (state: CallClientState): void => {
      const newProps = selector(state, selectorProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    callClient.onStateChange(onStateChange);
    return () => {
      callClient.offStateChange(onStateChange);
    };
  }, [callClient, selector, selectorProps]);
  return props;
};
