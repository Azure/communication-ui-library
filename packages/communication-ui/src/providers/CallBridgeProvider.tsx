// © Microsoft Corporation. All rights reserved.

import React, { createContext, useEffect, useState, useRef, useContext } from 'react';
import { CallingState, emptyCallingState } from '../acsDecouplingBridge/CallingState';
import { CallingActions, noopCallingActions } from '../acsDecouplingBridge/CallingActions';
import { CallingAdapter } from '../acsDecouplingBridge/CallingAdapter';
import { ErrorHandlingProps } from './ErrorProvider';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { produce } from 'immer';
import { StateStore } from './StateStore';

export interface CallBridgeProviderProps {
  children: React.ReactNode;
  userId: string;
  displayName: string;
  callingAdapter?: CallingAdapter;
  transformStateBeforeUpdate?: (state: CallingState) => CallingState;
}

export interface CallBridgeContextValue {
  store: StateStore<CallingState>;
  actions: CallingActions;
}

export const CallBridgeContext = createContext<CallBridgeContextValue | undefined>(undefined);

const CallProviderBase = (props: CallBridgeProviderProps): JSX.Element => {
  const { userId, displayName, callingAdapter, transformStateBeforeUpdate: transformState, children } = props;
  const [actions, setActions] = useState<CallingActions>(noopCallingActions);
  const store = useRef(new StateStore(emptyCallingState, transformState));

  const readState = store.current.getState;
  const writeState = store.current.setState;
  const isInitializing = useRef(false);

  useEffect(() => {
    if (!callingAdapter || readState().call.isInitialized || isInitializing.current) return;

    (async () => {
      isInitializing.current = true;
      const callingActions = await callingAdapter.createCallingActions(readState);
      callingAdapter.onStateChange(writeState);

      setActions(callingActions);

      writeState((prev) =>
        produce(prev, (draft) => {
          draft.call.isInitialized = true;
        })
      );

      isInitializing.current = false;
    })();
    return () => {
      console.log('unmount CallBridgeContext');
      writeState((prev) =>
        produce(prev, (draft) => {
          draft.call.isInitialized = false;
        })
      );
      callingAdapter.dispose();
    };
  }, [callingAdapter, readState, writeState]);

  useEffect(() => {
    actions.setDisplayName(displayName);
  }, [displayName, actions]);

  useEffect(() => {
    writeState((prev) =>
      produce(prev, (draft) => {
        draft.userId = userId;
      })
    );
  }, [userId, actions, readState, writeState]);

  // {declarative callstate, default handlers, composite state}
  return <CallBridgeContext.Provider value={{ store: store.current, actions }}>{children}</CallBridgeContext.Provider>;
};

export const CallBridgeProvider = (props: CallBridgeProviderProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(CallProviderBase, props);

export const useSelector = <T extends Record<string, unknown>>(select: (state: CallingState) => T): T => {
  const store = useContext(CallBridgeContext)?.store;
  if (!store) {
    console.warn('Using context before initialized');
  }
  const [state, setState] = useState(store?.getState());

  useEffect(() => {
    const unsubscribe = store?.onStateChange((state: CallingState) => {
      setState(state);
    });
    return unsubscribe;
  }, [store, setState]);

  return select(state ?? emptyCallingState);
};

export const useActions = <T extends Record<string, unknown>>(createActions: (actions: CallingActions) => T): T => {
  const context = useContext(CallBridgeContext);
  if (!context) {
    console.warn('Using context before initialized');
  }
  return createActions(context?.actions ?? noopCallingActions);
};
