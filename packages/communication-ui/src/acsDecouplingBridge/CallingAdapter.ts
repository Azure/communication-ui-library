// © Microsoft Corporation. All rights reserved.

import { CallingState } from './CallingState';
import { CallingActions } from './CallingActions';

export interface CallingStateHook {
  getState: () => Readonly<CallingState>;
  setState: (state: CallingState) => void;
}

/**
 * Implement this to hook a calling libary up with composites.
 * Works out of the box with @azure/communication-calling and @azure/communication-ui-selectors
 * but you can implement it with any library.
 */
export interface CallingAdapter {
  /**
   * Initialize the Calling library and create action handlers.
   */
  createCallingActions(getState: () => Readonly<CallingState>): Promise<CallingActions>;

  dispose(): Promise<void>;

  onStateChange(handler: (state: CallingState) => void): void;

  // makeDeclarative(callClient);
  // return defaultHandlers(declCallClient.state)
  // onStateChange(state: CallingAdapterState => void);
  // onStateChange(state: CallingCompositeUIState => void); // <-

  // declarative: onStateChange = merge(map(declarative state), ui state) = new ui state
  // webrtc: onStateChange = produce new ui state from old ui state
  // Composite state = {
  // uiState,  // muted
  // adapterState = declarative state,
  // }
}
