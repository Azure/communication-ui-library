// © Microsoft Corporation. All rights reserved.

import React, { createContext, useEffect, useState, useRef } from 'react';
import { CallingState, emptyCallingState } from '../acsDecouplingBridge/CallingState';
import { CallingActions, noopCallingActions } from '../acsDecouplingBridge/CallingActions';
import { CallingAdapter } from '../acsDecouplingBridge/CallingAdapter';
import { ErrorHandlingProps } from './ErrorProvider';
import { WithErrorHandling } from '../utils/WithErrorHandling';
import { produce } from 'immer';

export interface CallBridgeProviderProps {
  children: React.ReactNode;
  userId: string;
  displayName: string;
  callingAdapter?: CallingAdapter;
  transformStateBeforeUpdate?: (state: CallingState) => CallingState;
}

const isCallingState = (obj: CallingState | ((prev: CallingState) => CallingState)): obj is CallingState => {
  return typeof obj === 'object';
};

class CallingStateStore {
  private state: CallingState;
  private readonly triggerRender: (state: CallingState) => void;
  private readonly transform: ((state: CallingState) => CallingState) | undefined;

  constructor(
    state: CallingState,
    triggerRender: (state: CallingState) => void,
    transform?: (state: CallingState) => CallingState
  ) {
    this.state = state;
    this.triggerRender = triggerRender;
    this.transform = transform;
  }

  getCallingState = (): CallingState => {
    return this.state;
  };

  setCallingState = (newState: CallingState | ((prev: CallingState) => CallingState)): void => {
    const value = isCallingState(newState) ? newState : newState(this.state);
    const transformedValue = this.transform ? this.transform(value) : value;

    if (this.state === transformedValue) return;

    this.state = transformedValue;
    this.triggerRender(transformedValue);
  };
}

export interface CallBridgeContextValue {
  state: CallingState;
  actions: CallingActions;
}

export const CallBridgeContext = createContext<CallBridgeContextValue>({
  state: emptyCallingState,
  actions: noopCallingActions
});

const CallProviderBase = (props: CallBridgeProviderProps): JSX.Element => {
  const { userId, displayName, callingAdapter, transformStateBeforeUpdate: transformState, children } = props;
  const [state, setState] = useState<CallingState>(emptyCallingState);
  const [actions, setActions] = useState<CallingActions>(noopCallingActions);
  const store = useRef(new CallingStateStore(emptyCallingState, setState, transformState));
  // do this to fix stale state dependencies when effects run in the same render cycle
  // can we avoid useState for the state, and only trigger a render and always retrieve from the store?
  const readState = store.current.getCallingState;
  const writeState = store.current.setCallingState;
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
      // ToDo gets called all the time, find out why or find better place to tear down the calling stack
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
  return <CallBridgeContext.Provider value={{ state, actions }}>{children}</CallBridgeContext.Provider>;
};

export const CallBridgeProvider = (props: CallBridgeProviderProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(CallProviderBase, props);

// export const useCallBridgeContext = (): CallingState => useContext(CallBridgeContext)!;
