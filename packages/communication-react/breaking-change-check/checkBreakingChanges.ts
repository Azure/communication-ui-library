// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

// This file test all the most potential breaking changes
// It highly depends on how typescript thinks if 2 types are compatible
// Some breaking change definitions might be different in our sdk
import { CheckBreakingChanges, ExcludeList } from './CompareChanges';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export type BreakingChangeTest = CheckBreakingChanges<
  Omit<typeof import('./snapshots/communication-react'), ExcludeList>,
  typeof import('../dist/communication-react')
>;

type OmitState<T extends Object> = Omit<T, 'onStateChange' | 'offStateChange' | 'getState'>;

// Composite breaking change start
// For composite adapter, we defined adding new required functions is not a breaking change,
// This will still compare if the type has being changed
// or a property is accidentally removed.

type CompositePropsTestFunction<CompositeProps extends { adapter: any }> = (
  props: Omit<CompositeProps, 'adapter'>,
  adapter: OmitState<Partial<CompositeProps['adapter']>>
) => { props: Omit<CompositeProps, 'adapter'>; adapter: OmitState<CompositeProps['adapter']> };

type BreakingChangeCallWithChatCompositeTest = CheckBreakingChanges<
  CompositePropsTestFunction<import('./snapshots/communication-react').CallWithChatCompositeProps>,
  CompositePropsTestFunction<import('../dist/communication-react').CallWithChatCompositeProps>
>;

type BreakingChangeChatCompositeTest = CheckBreakingChanges<
  CompositePropsTestFunction<import('./snapshots/communication-react').ChatCompositeProps>,
  CompositePropsTestFunction<import('../dist/communication-react').ChatCompositeProps>
>;

type BreakingChangeCallCompositeTest = CheckBreakingChanges<
  CompositePropsTestFunction<import('./snapshots/communication-react').CallCompositeProps>,
  CompositePropsTestFunction<import('../dist/communication-react').CallCompositeProps>
>;

type NestedPartial<T> = {
  [K in keyof T]?: T[K] extends Object ? NestedPartial<T[K]> : T[K];
};

// State breaking change start
// For state, we defined adding new required properties would be not a breaking change,
// so we make everything nested props optional, it will still compare if the type has being changed
// or a property is accidentally removed
type StateTestFunction<State extends Object> = (state: NestedPartial<State>) => State;

type BreakingChangeChatAdapterStateTest = CheckBreakingChanges<
  StateTestFunction<import('./snapshots/communication-react').ChatAdapterState>,
  StateTestFunction<import('../dist/communication-react').ChatAdapterState>
>;

type BreakingChangeCallAdapterStateTest = CheckBreakingChanges<
  StateTestFunction<import('./snapshots/communication-react').CallAdapterState>,
  StateTestFunction<import('../dist/communication-react').CallAdapterState>
>;

type BreakingChangeCallWithChatAdapterStateTest = CheckBreakingChanges<
  StateTestFunction<import('./snapshots/communication-react').CallWithChatAdapterState>,
  StateTestFunction<import('../dist/communication-react').CallWithChatAdapterState>
>;

type BreakingChangeChatClientStateTest = CheckBreakingChanges<
  StateTestFunction<import('./snapshots/communication-react').ChatClientState>,
  StateTestFunction<import('../dist/communication-react').ChatClientState>
>;

type BreakingChangeCallClientStateTest = CheckBreakingChanges<
  StateTestFunction<import('./snapshots/communication-react').CallClientState>,
  StateTestFunction<import('../dist/communication-react').CallClientState>
>;

// Stateful client test start

type StatefulClientTestFunction<Client extends any> = (client: NestedPartial<OmitState<Partial<Client>>>) => Client;

type BreakingChangeStatefulCallClientTest = CheckBreakingChanges<
  StatefulClientTestFunction<import('./snapshots/communication-react').StatefulCallClient>,
  StatefulClientTestFunction<import('../dist/communication-react').StatefulCallClient>
>;

type BreakingChangeStatefulChatClientTest = CheckBreakingChanges<
  StatefulClientTestFunction<import('./snapshots/communication-react').StatefulChatClient>,
  StatefulClientTestFunction<import('../dist/communication-react').StatefulChatClient>
>;
