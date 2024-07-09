// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import {
  AzureCommunicationTokenCredential,
  CommunicationUserIdentifier,
  MicrosoftTeamsUserIdentifier
} from '@azure/communication-common';
import {
  CallAgent,
  CallCommon,
  IncomingCall,
  IncomingCallEvent,
  TeamsCallAgent,
  Call,
  TeamsCall,
  TeamsIncomingCallEvent,
  TeamsIncomingCall,
  CallClient,
  LocalVideoStream
} from '@azure/communication-calling';
import { fetchTokenResponse } from './utils/AppUtils';
import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  StatefulCallClient,
  createStatefulCallClient,
  fromFlatCommunicationIdentifier,
  IncomingCallNotification
} from '@azure/communication-react';
import { PrimaryButton, Stack, Text, TextField, initializeIcons, registerIcons } from '@fluentui/react';
import { CallingComponents } from './components/CallingComponents';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App() {
  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  const [userToken, setUserToken] = useState<string>('');
  const [tokenCredential, setTokenCredential] = useState<AzureCommunicationTokenCredential>();
  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState<string>();
  const [isCTEUser, setIsCTEUser] = useState<boolean>();
  const [teamsIdentityInformation, setTeamsIdentityInformation] = useState<{
    identifier: string | undefined;
    token: string | undefined;
  }>();

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent | TeamsCallAgent>();
  const [call, setCall] = useState<CallCommon>();
  const [acsIncomingCalls, setAcsIncomingCalls] = useState<IncomingCall[]>([]);
  const [incomingTeamsCalls, setIncomingTeamsCalls] = useState<TeamsIncomingCall[]>([]);

  const incomingAcsCallListener: IncomingCallEvent = ({ incomingCall }): void => {
    console.log('Incoming call received: ', incomingCall);
    setAcsIncomingCalls([...acsIncomingCalls, incomingCall]);
  };

  const teamsIncomingCallListener: TeamsIncomingCallEvent = ({ incomingCall }): void => {
    console.log('Incoming call received: ', incomingCall);
    setIncomingTeamsCalls([...incomingTeamsCalls, incomingCall]);
  };

  const callsUpdatedListener = (event: { added: CallCommon[]; removed: CallCommon[] }) => {
    if (event.added.length > 0) {
      if (call && call.state !== 'Disconnected') {
        call.hold();
      }
      setCall(event.added[0]);
    } else if (event.removed.length > 0) {
      if (event.removed[0] === call) {
        setCall(undefined);
      }
    }
  };

  const clientTest = useCallback((client: CallClient) => {
    console.log('clientTest', client);
  }, []);

  if (statefulCallClient) {
    clientTest(statefulCallClient);
  }

  // Examples for Callback functions for utilizing incomingCall reject and accept.
  const onRejectACSCall = (incomingCall: IncomingCall): void => {
    if (incomingCall) {
      incomingCall.reject();
    }
    setAcsIncomingCalls(acsIncomingCalls.filter((call) => call.id !== incomingCall.id));
  };

  const onAcceptACSCall = async (incomingCall: IncomingCall, useVideo?: boolean): Promise<void> => {
    const cameras = statefulCallClient?.getState().deviceManager.cameras;
    let localVideoStream: LocalVideoStream | undefined;
    if (cameras && useVideo) {
      localVideoStream = new LocalVideoStream(cameras[0]);
    }
    if (incomingCall) {
      await incomingCall.accept(
        localVideoStream ? { videoOptions: { localVideoStreams: [localVideoStream] } } : undefined
      );
    }
    setAcsIncomingCalls(acsIncomingCalls.filter((call) => call.id !== incomingCall.id));
  };

  const onRejectTeamsCall = (incomingCall: TeamsIncomingCall): void => {
    if (incomingCall) {
      incomingCall.reject();
    }
    setIncomingTeamsCalls(incomingTeamsCalls.filter((call) => call.id !== incomingCall.id));
  };

  const onAcceptTeamsCall = async (incomingCall: TeamsIncomingCall, useVideo?: boolean): Promise<void> => {
    const cameras = statefulCallClient?.getState().deviceManager.cameras;
    let localVideoStream: LocalVideoStream | undefined;
    if (cameras && useVideo) {
      localVideoStream = new LocalVideoStream(cameras[0]);
    }
    if (incomingCall) {
      await incomingCall.accept(
        localVideoStream ? { videoOptions: { localVideoStreams: [localVideoStream] } } : undefined
      );
    }
    setIncomingTeamsCalls(incomingTeamsCalls.filter((call) => call.id !== incomingCall.id));
  };

  // Get Azure Communications Service token and Voice app identification from the server.
  useEffect(() => {
    (async () => {
      if (isCTEUser === false) {
        try {
          const { token, user } = await fetchTokenResponse();
          console.log('Token fetched: ', token);
          console.log('User fetched: ', user);
          setUserToken(token);
          setUserIdentifier(user);
          setTokenCredential(new AzureCommunicationTokenCredential(token));
        } catch (e) {
          console.error(e);
          setUserCredentialFetchError(true);
        }
      }
    })();
  }, [isCTEUser]);

  useEffect(() => {
    if (isCTEUser === true && teamsIdentityInformation?.identifier !== undefined) {
      setStatefulCallClient(
        createStatefulCallClient({
          userId: fromFlatCommunicationIdentifier(teamsIdentityInformation.identifier) as MicrosoftTeamsUserIdentifier
        })
      );
      return;
    }
    if (!userIdentifier) return;
    setStatefulCallClient(createStatefulCallClient({ userId: userIdentifier }));
  }, [userIdentifier, isCTEUser, teamsIdentityInformation]);

  useEffect(() => {
    if (callAgent === undefined && statefulCallClient && tokenCredential) {
      const createCallAgent = async (): Promise<void> => {
        setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName }));
      };
      createCallAgent();
      console.log('ACS CallAgent created', callAgent);
    } else if (callAgent === undefined && statefulCallClient && isCTEUser) {
      const createTeamsCallAgent = async (): Promise<void> => {
        if (teamsIdentityInformation?.token !== undefined) {
          setCallAgent(
            await statefulCallClient.createTeamsCallAgent(
              new AzureCommunicationTokenCredential(teamsIdentityInformation.token)
            )
          );
        }
      };
      createTeamsCallAgent();
    }
    console.log('CallAgent created', callAgent);
  }, [callAgent, statefulCallClient, tokenCredential, displayName]);

  useEffect(() => {
    if (!callAgent) return;
    if (callAgent.kind === 'TeamsCallAgent') {
      console.log('Subscribing to teams events');
      (callAgent as TeamsCallAgent).on('callsUpdated', callsUpdatedListener);
      (callAgent as TeamsCallAgent).on('incomingCall', teamsIncomingCallListener);
      return () => {
        (callAgent as TeamsCallAgent).off('incomingCall', teamsIncomingCallListener);
        (callAgent as TeamsCallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else if (callAgent.kind === 'CallAgent') {
      console.log('subscribing to ACS CallAgent events');
      // there is an issue here with the kind prop that requires this casting..
      (callAgent as CallAgent).on('incomingCall', incomingAcsCallListener);
      (callAgent as CallAgent).on('callsUpdated', callsUpdatedListener);
      return () => {
        (callAgent as CallAgent).off('incomingCall', incomingAcsCallListener);
        (callAgent as CallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else {
      throw new Error('Unknown call agent kind');
    }
  }, [callAgent, call]);

  if (userCredentialFetchError) {
    return <Text>Failed to fetch user credentials</Text>;
  }

  if (isCTEUser === undefined) {
    return (
      <FluentThemeProvider>
        <Stack
          verticalAlign="center"
          tokens={{ childrenGap: '1rem' }}
          style={{ width: '30rem', height: '100%', margin: 'auto', paddingTop: '4rem', position: 'relative' }}
        >
          <Text styles={{ root: { fontWeight: 700, fontSize: 'large' } }}>login</Text>
          <Text>
            Enter your Teams information if you want to login with CTE. Leave blank if you want to log in with ACS
          </Text>
          <TextField
            placeholder="Enter your CTE Id"
            onChange={(_, value) =>
              setTeamsIdentityInformation({ identifier: value, token: teamsIdentityInformation?.token })
            }
          ></TextField>
          <TextField
            placeholder="Enter your CTE Token"
            onChange={(_, value) =>
              setTeamsIdentityInformation({ identifier: teamsIdentityInformation?.identifier, token: value })
            }
          ></TextField>
          <PrimaryButton onClick={() => setIsCTEUser(!!teamsIdentityInformation)}>
            {teamsIdentityInformation ? <Text>Login CTE</Text> : <Text>Login ACS</Text>}
          </PrimaryButton>
        </Stack>
      </FluentThemeProvider>
    );
  }

  return (
    <Stack
      verticalAlign="center"
      tokens={{ childrenGap: '1rem' }}
      style={{ width: '100%', height: '100vh', margin: 'auto', paddingTop: '4rem', position: 'relative' }}
    >
      <FluentThemeProvider>
        {userIdentifier && <Text>your userId: {userIdentifier.communicationUserId}</Text>}
        {teamsIdentityInformation && <Text>your teamsId: {teamsIdentityInformation.identifier}</Text>}
        {statefulCallClient && (
          <Stack style={{ width: '100%', height: '100%', margin: 'auto', position: 'relative' }}>
            <CallClientProvider callClient={statefulCallClient}>
              {callAgent && (
                <CallAgentProvider callAgent={callAgent}>
                  {call && (
                    <CallProvider call={call.kind === 'Call' ? (call as Call) : (call as TeamsCall)}>
                      <CallingComponents></CallingComponents>
                    </CallProvider>
                  )}
                </CallAgentProvider>
              )}
            </CallClientProvider>
          </Stack>
        )}
        {acsIncomingCalls.length > 0 && (
          <Stack>
            <Text variant="large">Incoming calls</Text>
            {acsIncomingCalls.map((incomingCall) => (
              <IncomingCallNotification
                callerName={incomingCall.callerInfo.displayName}
                onAcceptWithAudio={() => onAcceptACSCall(incomingCall)}
                onAcceptWithVideo={() => onAcceptACSCall(incomingCall)}
                onReject={() => onRejectACSCall(incomingCall)}
              ></IncomingCallNotification>
            ))}
          </Stack>
        )}
        {incomingTeamsCalls.length > 0 && (
          <Stack>
            <Text variant="large">Incoming Teams calls</Text>
            {incomingTeamsCalls.map((incomingCall) => (
              <IncomingCallNotification
                callerName={incomingCall.callerInfo.displayName}
                onAcceptWithAudio={() => onAcceptTeamsCall(incomingCall)}
                onAcceptWithVideo={() => onAcceptTeamsCall(incomingCall)}
                onReject={() => onRejectTeamsCall(incomingCall)}
              ></IncomingCallNotification>
            ))}
          </Stack>
        )}
      </FluentThemeProvider>
    </Stack>
  );
}

export default App;
