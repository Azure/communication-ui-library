// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useState } from 'react';
import './App.css';
import { CommunicationUserIdentifier } from '@azure/communication-common';
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
  LocalVideoStream
} from '@azure/communication-calling';
import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  StatefulCallClient,
  IncomingCallNotification,
  DeclarativeCallAgent,
  DeclarativeTeamsCallAgent
} from '@azure/communication-react';
import { Stack, Text, Image, initializeIcons, registerIcons } from '@fluentui/react';
import { CallingComponents } from './components/CallingComponents';
import heroSVG from './assets/hero.svg';
import { imgStyle } from './styles/HomeScreen.styles';
import { Login } from './views/Login';
initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App() {
  const imageProps = { src: heroSVG.toString() };
  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  const [teamsIdentifier, setTeamsIdentifier] = useState<string>();

  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  const [isCTEUser, setIsCTEUser] = useState<boolean>();
  const [numberOfIncomingCalls, setNumberOfIncomingCalls] = useState<number>(0);

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent | DeclarativeTeamsCallAgent>();
  const [call, setCall] = useState<CallCommon>();
  const [acsIncomingCalls, setAcsIncomingCalls] = useState<readonly IncomingCall[]>([]);
  const [incomingTeamsCalls, setIncomingTeamsCalls] = useState<readonly TeamsIncomingCall[]>([]);

  const incomingAcsCallListener: IncomingCallEvent = ({ incomingCall }): void => {
    console.log('Incoming call received: ', incomingCall);
    if (callAgent) {
      setAcsIncomingCalls(callAgent.incomingCalls);
    }
  };

  const teamsIncomingCallListener: TeamsIncomingCallEvent = ({ incomingCall }): void => {
    console.log('Incoming call received: ', incomingCall);
    if (callAgent) {
      setIncomingTeamsCalls(callAgent.incomingCalls);
    }
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

  useEffect(() => {
    setNumberOfIncomingCalls(isCTEUser ? incomingTeamsCalls.length : acsIncomingCalls.length);
  }, [incomingTeamsCalls, acsIncomingCalls]);

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

  if (statefulCallClient === undefined || callAgent === undefined) {
    return (
      <Login
        onSetIsCTE={setIsCTEUser}
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
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        tokens={{ childrenGap: '1rem' }}
        style={{ width: '30rem', height: '100%', margin: 'auto', paddingTop: '4rem', position: 'relative' }}
      >
        <Image alt="Welcome to the ACS Calling sample app" className={imgStyle} {...imageProps} />
        {userIdentifier && <Text>your userId: {userIdentifier.communicationUserId}</Text>}
        {teamsIdentifier && <Text>your teamsId: {teamsIdentifier}</Text>}
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
            <Text variant="large">Incoming calls {numberOfIncomingCalls}</Text>
            {acsIncomingCalls.map((incomingCall) => (
              <IncomingCallNotification
                callerName={incomingCall.callerInfo.displayName}
                onAcceptWithAudio={() => onAcceptACSCall(incomingCall)}
                onAcceptWithVideo={() => onAcceptACSCall(incomingCall, true)}
                onReject={() => onRejectACSCall(incomingCall)}
              ></IncomingCallNotification>
            ))}
          </Stack>
        )}
        {incomingTeamsCalls.length > 0 && (
          <Stack>
            <Text variant="large">Incoming Teams calls {numberOfIncomingCalls}</Text>
            {incomingTeamsCalls.map((incomingCall) => (
              <IncomingCallNotification
                callerName={incomingCall.callerInfo.displayName}
                onAcceptWithAudio={() => onAcceptTeamsCall(incomingCall)}
                onAcceptWithVideo={() => onAcceptTeamsCall(incomingCall, true)}
                onReject={() => onRejectTeamsCall(incomingCall)}
              ></IncomingCallNotification>
            ))}
          </Stack>
        )}
      </Stack>
    </FluentThemeProvider>
  );
}

export default App;
