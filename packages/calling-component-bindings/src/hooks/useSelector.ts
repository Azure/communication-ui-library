// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  CallClientState,
  MediaClientState,
  _SESSION_PLACEHOLDER_ID,
  StatefulCallClient,
  StatefulMediaClient
} from '@internal/calling-stateful-client';
import { CallClientContext, CallContext, MediaStreamSessionContext } from '../providers';

import { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { MediaClientContext } from '../providers/MediaClientProvider';

/**
 * Hook to obtain a selector for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useSelector = <SelectorT extends (state: any, props: any) => any, ParamT extends SelectorT | undefined>(
  selector: ParamT,
  selectorProps?: Parameters<SelectorT>[1]
): ParamT extends SelectorT ? ReturnType<SelectorT> : undefined => {
  const callClient: StatefulCallClient | undefined = useContext(CallClientContext)?.callClient;
  const callId = useContext(CallContext)?.call?.id;
  const mediaClient: StatefulMediaClient | undefined = useContext(MediaClientContext)?.mediaClient;
  const sessionId = useContext(MediaStreamSessionContext)?.session ? _SESSION_PLACEHOLDER_ID : undefined;

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

  const sessionIdConfigProps = useMemo(
    () => ({
      sessionId
    }),
    [sessionId]
  );

  const [props, setProps] = useState(
    callClient && selector
      ? selector(callClient.getState(), selectorProps ?? callIdConfigProps)
      : mediaClient && selector
        ? selector(mediaClient.getState(), selectorProps ?? sessionIdConfigProps)
        : undefined
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

  useEffect(() => {
    if (!mediaClient || !selector) {
      return;
    }
    const onStateChange = (state: MediaClientState): void => {
      if (!mounted.current) {
        return;
      }
      const newProps = selector(state, selectorProps ?? sessionIdConfigProps);
      if (propRef.current !== newProps) {
        setProps(newProps);
      }
    };
    mediaClient.onStateChange(onStateChange);
    return () => {
      mediaClient.offStateChange(onStateChange);
    };
  }, [mediaClient, selector, selectorProps, sessionIdConfigProps, mounted]);

  return selector ? props : undefined;
};
