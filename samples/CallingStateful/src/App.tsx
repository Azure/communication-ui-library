// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
/* @conditional-compile-remove(one-to-n-calling) */
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { Call, CallCommon, TeamsCall } from '@azure/communication-calling';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallAgent } from '@azure/communication-calling';
import {
  DEFAULT_COMPONENT_ICONS,
  CallClientProvider,
  FluentThemeProvider,
  StatefulCallClient,
  CallClientState
} from '@azure/communication-react';
/* @conditional-compile-remove(one-to-n-calling) */
import {
  DeclarativeCallAgent,
  DeclarativeTeamsCallAgent,
  CallProvider,
  CallAgentProvider
} from '@azure/communication-react';
import { Text, initializeIcons, registerIcons } from '@fluentui/react';
/* @conditional-compile-remove(one-to-n-calling) */
import { Stack } from '@fluentui/react';
import heroSVG from './assets/hero.svg';
import { LoginScreen } from './views/Login';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallScreen } from './views/CallScreen';
/* @conditional-compile-remove(one-to-n-calling) */
import { HomeScreen } from './views/Homescreen';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallManager } from './components/CallManager';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  const imageProps = { src: heroSVG.toString() };
  /* @conditional-compile-remove(one-to-n-calling) */
  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  /* @conditional-compile-remove(one-to-n-calling) */
  const [teamsIdentifier, setTeamsIdentifier] = useState<string>();

  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  /* @conditional-compile-remove(one-to-n-calling) */
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent | DeclarativeTeamsCallAgent>();
  const [call, setCall] = useState<Call | TeamsCall>();
  /* @conditional-compile-remove(one-to-n-calling) */
  const [calls, setCalls] = useState<Call[] | TeamsCall[]>([]);

  const statefulCallClientUpdatedListener = useCallback(
    (newStatefulCallClient: CallClientState): void => {
      if (newStatefulCallClient.callAgent && /* @conditional-compile-remove(one-to-n-calling) */ callAgent?.calls) {
        /* @conditional-compile-remove(one-to-n-calling) */
        setCalls((callAgent?.calls as Call[] | TeamsCall[]) || []);
      }
    },
    [/* @conditional-compile-remove(one-to-n-calling) */ callAgent]
  );

  useEffect(() => {
    if (statefulCallClient) {
      statefulCallClient.onStateChange(statefulCallClientUpdatedListener);
    }
    return () => {
      if (statefulCallClient) {
        statefulCallClient.offStateChange(statefulCallClientUpdatedListener);
      }
    };
  }, [statefulCallClient, statefulCallClientUpdatedListener]);

  const callsUpdatedListener = useCallback(
    (event: { added: CallCommon[]; removed: CallCommon[] }): void => {
      if (event.added.length > 0) {
        if (call && call.state !== 'Disconnected') {
          call.hold();
        }
        setCall(event.added[0] as Call | TeamsCall);
      } else if (event.removed.length > 0) {
        if (event.removed[0] === call) {
          setCall(undefined);
          console.log(call.id, call.callEndReason);
        }
      }
    },
    [call]
  );

  useEffect(() => {
    /* @conditional-compile-remove(one-to-n-calling) */
    if (!callAgent) {
      return;
    }
    /* @conditional-compile-remove(one-to-n-calling) */
    if (callAgent.kind === 'TeamsCallAgent') {
      console.log('Subscribing to teams events');
      /* @conditional-compile-remove(one-to-n-calling) */
      (callAgent as DeclarativeTeamsCallAgent).on('callsUpdated', callsUpdatedListener);
      return () => {
        /* @conditional-compile-remove(one-to-n-calling) */
        (callAgent as DeclarativeTeamsCallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else if (callAgent.kind === 'CallAgent') {
      console.log('subscribing to ACS CallAgent events');
      /* @conditional-compile-remove(one-to-n-calling) */
      (callAgent as DeclarativeCallAgent).on('callsUpdated', callsUpdatedListener);
      return () => {
        /* @conditional-compile-remove(one-to-n-calling) */
        (callAgent as DeclarativeCallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else {
      throw new Error('Unknown call agent kind');
    }
  }, [/* @conditional-compile-remove(one-to-n-calling) */ callAgent, callsUpdatedListener]);

  if (userCredentialFetchError) {
    return <Text>Failed to fetch user credentials</Text>;
  }

  if (statefulCallClient === undefined || /* @conditional-compile-remove(one-to-n-calling) */ callAgent === undefined) {
    return (
      <LoginScreen
        onSetStatefulClient={setStatefulCallClient}
        /* @conditional-compile-remove(one-to-n-calling) */
        onSetCallAgent={setCallAgent}
        /* @conditional-compile-remove(one-to-n-calling) */
        onSetUserIdentifier={setUserIdentifier}
        headerImageProps={imageProps}
        setTokenCredentialError={setUserCredentialFetchError}
        /* @conditional-compile-remove(one-to-n-calling) */
        onSetTeamsIdentity={setTeamsIdentifier}
      />
    );
  }

  return (
    <FluentThemeProvider>
      <CallClientProvider callClient={statefulCallClient}>
        <>
          {
            /* @conditional-compile-remove(one-to-n-calling) */ <CallAgentProvider callAgent={callAgent}>
              <Stack horizontal>
                <Stack
                  verticalAlign="center"
                  horizontalAlign="center"
                  tokens={{ childrenGap: '1rem' }}
                  style={{ width: '100%', height: '40rem', margin: 'auto', paddingTop: '1rem', position: 'relative' }}
                >
                  {userIdentifier && <Text>your userId: {userIdentifier.communicationUserId}</Text>}
                  {teamsIdentifier && <Text>your teamsId: {teamsIdentifier}</Text>}
                  {
                    /* @conditional-compile-remove(one-to-n-calling) */ statefulCallClient && callAgent && !call && (
                      <HomeScreen callAgent={callAgent as CallAgent} headerImageProps={imageProps}></HomeScreen>
                    )
                  }
                  {statefulCallClient && /* @conditional-compile-remove(one-to-n-calling) */ callAgent && call && (
                    <CallProvider call={call.kind === 'Call' ? (call as Call) : (call as TeamsCall)}>
                      <CallScreen
                        /* @conditional-compile-remove(one-to-n-calling) */ call={call}
                        /* @conditional-compile-remove(one-to-n-calling) */ onSetCall={setCall}
                      />
                    </CallProvider>
                  )}
                </Stack>
                {calls.length > 0 && (
                  <Stack style={{ minWidth: '15rem', height: '100%', paddingTop: '3rem' }}>
                    <Stack.Item style={{ width: '100%', height: '30rem' }}>
                      <CallManager
                        activeCall={call}
                        calls={calls}
                        onSetResume={function (newCall: Call | TeamsCall): void {
                          if (call) {
                            call.hold();
                            newCall.resume();
                            setCall(newCall);
                          } else {
                            newCall.resume();
                            setCall(newCall);
                          }
                        }}
                        onSetHold={function (callToHold: Call | TeamsCall): void {
                          callToHold.hold();
                        }}
                        onEndCall={function (callCallToEnd: Call | TeamsCall): void {
                          callCallToEnd.hangUp();
                        }}
                      />
                    </Stack.Item>
                  </Stack>
                )}
              </Stack>
            </CallAgentProvider>
          }
        </>
      </CallClientProvider>
    </FluentThemeProvider>
  );
}

export default App;
