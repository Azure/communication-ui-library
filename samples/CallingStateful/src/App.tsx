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
  TeamsIncomingCallEvent,
  TeamsIncomingCall,
  LocalVideoStream,
  IncomingCallCommon
} from '@azure/communication-calling';
import {
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  StatefulCallClient,
  IncomingCallNotification,
  DeclarativeCallAgent,
  DeclarativeTeamsCallAgent,
  CallClientState
} from '@azure/communication-react';
import { Stack, Text, initializeIcons, registerIcons } from '@fluentui/react';
import heroSVG from './assets/hero.svg';
import { LoginScreen } from './views/Login';
import { CallScreen } from './views/CallScreen';
initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App() {
  const imageProps = { src: heroSVG.toString() };
  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  const [teamsIdentifier, setTeamsIdentifier] = useState<string>();

  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent | DeclarativeTeamsCallAgent>();
  const [call, setCall] = useState<CallCommon>();
  const [incomingCalls, setIncomingCalls] = useState<readonly IncomingCall[] | readonly TeamsIncomingCall[]>([]);

  /**
   * Helper function to clear the old incoming Calls in the app that are no longer valid.
   * @param statefulClient
   */
  const filterEndedIncomingCalls = (incomingCall: IncomingCallCommon) => {
    setIncomingCalls(incomingCalls.filter((call) => call.id !== incomingCall.id));
  };

  const incomingAcsCallListener: IncomingCallEvent = ({ incomingCall }): void => {
    console.log('Incoming call received: ', incomingCall);
    if (callAgent) {
      setIncomingCalls(callAgent.incomingCalls);
    }
  };

  const teamsIncomingCallListener: TeamsIncomingCallEvent = ({ incomingCall }): void => {
    console.log('Incoming call received: ', incomingCall);
    if (callAgent) {
      setIncomingCalls(callAgent.incomingCalls);
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

  /**
   * We need to check the call client to make sure we are removing any of the notifications that
   * are no longer valid.
   */
  const statefulCallClientStateListener = (state: CallClientState): void => {
    if (statefulCallClient) {
      const endedIncomingCalls = Object.keys(state.incomingCallsEnded);
      setIncomingCalls(incomingCalls.filter((call) => !endedIncomingCalls.includes(call.id)));
    }
  };

  // Examples for Callback functions for utilizing incomingCall reject and accept.
  const onRejectCall = (incomingCall: IncomingCall | TeamsIncomingCall): void => {
    if (incomingCall && callAgent) {
      incomingCall.reject();
      filterEndedIncomingCalls(incomingCall);
    }
  };

  const onAcceptCall = async (incomingCall: IncomingCall | TeamsIncomingCall, useVideo?: boolean): Promise<void> => {
    const cameras = statefulCallClient?.getState().deviceManager.cameras;
    console.log(cameras);
    let localVideoStream: LocalVideoStream | undefined;
    if (cameras && useVideo) {
      localVideoStream = new LocalVideoStream(cameras[0]);
    }
    if (incomingCall && callAgent) {
      await incomingCall.accept(
        localVideoStream ? { videoOptions: { localVideoStreams: [localVideoStream] } } : undefined
      );
      filterEndedIncomingCalls(incomingCall);
    }
  };

  useEffect(() => {
    if (statefulCallClient) {
      statefulCallClient.onStateChange(statefulCallClientStateListener);
    }
    return () => {
      statefulCallClient?.offStateChange(statefulCallClientStateListener);
    };
  }, [statefulCallClient]);

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
      <Stack
        verticalAlign="center"
        horizontalAlign="center"
        tokens={{ childrenGap: '1rem' }}
        style={{ width: '100%', height: '40rem', margin: 'auto', paddingTop: '1rem', position: 'relative' }}
      >
        {userIdentifier && <Text>your userId: {userIdentifier.communicationUserId}</Text>}
        {teamsIdentifier && <Text>your teamsId: {teamsIdentifier}</Text>}
        {statefulCallClient && callAgent && call && (
          <CallScreen statefulCallClient={statefulCallClient} callAgent={callAgent} call={call} onSetCall={setCall} />
        )}
        <IncomingCallManager incomingCalls={incomingCalls} onAcceptCall={onAcceptCall} onRejectCall={onRejectCall} />
      </Stack>
    </FluentThemeProvider>
  );
}

export default App;

interface IncomingCallManagerProps {
  incomingCalls: readonly IncomingCall[] | readonly TeamsIncomingCall[];
  onAcceptCall: (incomingCall: IncomingCall | TeamsIncomingCall, useVideo?: boolean) => void;
  onRejectCall: (incomingCall: IncomingCall | TeamsIncomingCall) => void;
}

const IncomingCallManager = (props: IncomingCallManagerProps): JSX.Element => {
  const { incomingCalls, onAcceptCall, onRejectCall } = props;
  return (
    <Stack style={{ top: 0, position: 'absolute' }}>
      {incomingCalls.map((incomingCall) => (
        <IncomingCallNotification
          callerName={incomingCall.callerInfo.displayName}
          onAcceptWithAudio={() => onAcceptCall(incomingCall)}
          onAcceptWithVideo={() => onAcceptCall(incomingCall, true)}
          onReject={() => onRejectCall(incomingCall)}
        ></IncomingCallNotification>
      ))}
    </Stack>
  );
};
