// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useState, useEffect } from 'react';

import { CallAdapter } from '../../../src';
import { MockCallAdapter } from '../lib/MockCallAdapter';
import { QueryArgs } from './QueryArgs';
import { BaseApp } from './BaseApp';
import { initializeIconsForUITests } from '../lib/utils';
import type { MockCallAdapterState, MockRemoteParticipantState } from '../../common';

initializeIconsForUITests();

/**
 * A hermetic test application that simpy loads the given static `{@link mockCallAdapterState}.
 *
 * Most {@link CallAdapter} methods are stubbed out.
 */
export function HermeticApp(props: { queryArgs: QueryArgs }): JSX.Element {
  const { queryArgs } = props;

  const [callAdapter, setCallAdapter] = useState<CallAdapter | undefined>(undefined);

  useEffect(() => {
    ((): void => {
      if (queryArgs.makeMeLotsOfPeople && queryArgs.mockCallAdapterState?.call) {
        const participants: { [keys: string]: MockRemoteParticipantState } = {};
        const call = queryArgs.mockCallAdapterState.call;
        for (let i = 0; i < 150; i++) {
          participants[i] = {
            identifier: { communicationUserId: `user${i}`, kind: 'communicationUser' },
            displayName: `User ${i}`,
            state: 'Connected',
            isMuted: false,
            isSpeaking: false,
            videoStreams: {}
          };
        }
        const callAdapterState: MockCallAdapterState = {
          ...queryArgs.mockCallAdapterState,
          call: {
            ...call,
            localVideoStreams: [],
            remoteParticipants: participants,
            totalParticipantCount: Object.values(participants).length + 1
          }
        };
        console.log('Creating mock adapter with args', queryArgs.mockCallAdapterState);
        console.log(callAdapterState.call?.totalParticipantCount);
        setCallAdapter(new MockCallAdapter(callAdapterState));
      } else {
        console.log('Creating mock adapter with args', queryArgs.mockCallAdapterState);
        setCallAdapter(new MockCallAdapter(queryArgs.mockCallAdapterState));
      }
    })();
  }, [queryArgs.mockCallAdapterState, queryArgs.makeMeLotsOfPeople]);

  return <BaseApp queryArgs={queryArgs} callAdapter={callAdapter} />;
}

/** @internal */
export function shouldLoadHermeticApp(queryArgs: QueryArgs): boolean {
  return !!queryArgs.mockCallAdapterState;
}
