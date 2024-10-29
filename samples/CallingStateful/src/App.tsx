// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import { Call, CallCommon, TeamsCall } from '@azure/communication-calling';
import { CallAgent } from '@azure/communication-calling';
import {
  DEFAULT_COMPONENT_ICONS,
  CallClientProvider,
  FluentThemeProvider,
  StatefulCallClient,
  CallClientState
} from '@azure/communication-react';
import {
  DeclarativeCallAgent,
  DeclarativeTeamsCallAgent,
  CallProvider,
  CallAgentProvider
} from '@azure/communication-react';
import { Text, initializeIcons, registerIcons } from '@fluentui/react';
import { Stack } from '@fluentui/react';
import heroSVG from './assets/hero.svg';
import { LoginScreen } from './views/Login';
import { CallScreen } from './views/CallScreen';
import { HomeScreen } from './views/Homescreen';
import { CallManager } from './components/CallManager';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  const imageProps = { src: heroSVG.toString() };
  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  const [teamsIdentifier, setTeamsIdentifier] = useState<string>();

  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent | DeclarativeTeamsCallAgent>();
  const [call, setCall] = useState<Call | TeamsCall>();
  const [calls, setCalls] = useState<Call[] | TeamsCall[]>([]);

  const statefulCallClientUpdatedListener = useCallback(
    (newStatefulCallClient: CallClientState): void => {
      if (newStatefulCallClient.callAgent && callAgent?.calls) {
        setCalls((callAgent?.calls as Call[] | TeamsCall[]) || []);
      }
    },
    [callAgent]
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
          console.log(call?.id, call?.callEndReason);
        }
      }
    },
    [call]
  );

  useEffect(() => {
    if (!callAgent) {
      return;
    }
    if (callAgent.kind === 'TeamsCallAgent') {
      console.log('Subscribing to teams events');
      (callAgent as DeclarativeTeamsCallAgent).on('callsUpdated', callsUpdatedListener);
      return () => {
        (callAgent as DeclarativeTeamsCallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else if (callAgent.kind === 'CallAgent') {
      console.log('subscribing to ACS CallAgent events');
      (callAgent as DeclarativeCallAgent).on('callsUpdated', callsUpdatedListener);
      return () => {
        (callAgent as DeclarativeCallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else {
      throw new Error('Unknown call agent kind');
    }
  }, [callAgent, callsUpdatedListener]);

  if (userCredentialFetchError) {
    return <Text>Failed to fetch user credentials</Text>;
  }

  if (statefulCallClient === undefined || callAgent === undefined) {
    return (
      <LoginScreen
        onSetStatefulClient={setStatefulCallClient}
        onSetCallAgent={setCallAgent}
        onSetUserIdentifier={setUserIdentifier}
        headerImageProps={imageProps}
        setTokenCredentialError={setUserCredentialFetchError}
        onSetTeamsIdentity={setTeamsIdentifier}
      />
    );
  }

  return (
    <FluentThemeProvider>
      <CallClientProvider callClient={statefulCallClient}>
        <>
          {
            <CallAgentProvider callAgent={callAgent}>
              <Stack horizontal>
                <Stack
                  verticalAlign="center"
                  horizontalAlign="center"
                  tokens={{ childrenGap: '1rem' }}
                  style={{ width: '100%', height: '40rem', margin: 'auto', paddingTop: '1rem', position: 'relative' }}
                >
                  {userIdentifier && <Text>your userId: {userIdentifier.communicationUserId}</Text>}
                  {teamsIdentifier && <Text>your teamsId: {teamsIdentifier}</Text>}
                  {statefulCallClient && callAgent && !call && (
                    <HomeScreen callAgent={callAgent as CallAgent} headerImageProps={imageProps}></HomeScreen>
                  )}
                  {statefulCallClient && callAgent && call && (
                    <CallProvider call={call.kind === 'Call' ? (call as Call) : (call as TeamsCall)}>
                      <CallScreen call={call} onSetCall={setCall} />
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
