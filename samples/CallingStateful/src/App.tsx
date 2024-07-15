// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import { CommunicationUserIdentifier } from '@azure/communication-common';
import {
  CallCommon,
  IncomingCall,
  TeamsIncomingCall,
  LocalVideoStream,
  IncomingCallCommon
} from '@azure/communication-calling';
/* @conditional-compile-remove(one-to-n-calling) */
import { IncomingCallEvent, TeamsIncomingCallEvent, CallAgent } from '@azure/communication-calling';
import {
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  StatefulCallClient,
  CallClientState
} from '@azure/communication-react';
/* @conditional-compile-remove(one-to-n-calling) */
import { DeclarativeCallAgent, DeclarativeTeamsCallAgent } from '@azure/communication-react';
import { Stack, Text, initializeIcons, registerIcons } from '@fluentui/react';
import heroSVG from './assets/hero.svg';
import { LoginScreen } from './views/Login';
import { CallScreen } from './views/CallScreen';
import { IncomingCallManager } from './components/IncomingCallManager';
/* @conditional-compile-remove(one-to-n-calling) */
import { HomeScreen } from './views/Homescreen';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  const imageProps = { src: heroSVG.toString() };
  const [userIdentifier, setUserIdentifier] = useState<CommunicationUserIdentifier>();
  const [teamsIdentifier, setTeamsIdentifier] = useState<string>();

  const [userCredentialFetchError, setUserCredentialFetchError] = useState<boolean>(false);

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  /* @conditional-compile-remove(one-to-n-calling) */
  const [callAgent, setCallAgent] = useState<DeclarativeCallAgent | DeclarativeTeamsCallAgent>();
  const [call, setCall] = useState<CallCommon>();
  const [incomingCalls, setIncomingCalls] = useState<readonly IncomingCall[] | readonly TeamsIncomingCall[]>([]);

  /**
   * Helper function to clear the old incoming Calls in the app that are no longer valid.
   * @param statefulClient
   */
  const filterEndedIncomingCalls = useCallback(
    (incomingCall: IncomingCallCommon): void => {
      setIncomingCalls(incomingCalls.filter((call) => call.id !== incomingCall.id));
    },
    [incomingCalls]
  );

  /* @conditional-compile-remove(one-to-n-calling) */
  const incomingAcsCallListener: IncomingCallEvent = useCallback(
    ({ incomingCall }): void => {
      console.log('Incoming call received: ', incomingCall);
      if (callAgent) {
        setIncomingCalls(callAgent.incomingCalls);
      }
    },
    [callAgent]
  );

  /* @conditional-compile-remove(one-to-n-calling) */
  const teamsIncomingCallListener: TeamsIncomingCallEvent = useCallback(
    ({ incomingCall }): void => {
      console.log('Incoming call received: ', incomingCall);
      if (callAgent) {
        setIncomingCalls(callAgent.incomingCalls);
      }
    },
    [callAgent]
  );

  const callsUpdatedListener = useCallback(
    (event: { added: CallCommon[]; removed: CallCommon[] }): void => {
      if (event.added.length > 0) {
        if (call && call.state !== 'Disconnected') {
          call.hold();
        }
        setCall(event.added[0]);
      } else if (event.removed.length > 0) {
        if (event.removed[0] === call) {
          setCall(undefined);
          console.log(call.id, call.callEndReason);
        }
      }
    },
    [call, setCall]
  );

  /**
   * We need to check the call client to make sure we are removing any of the notifications that
   * are no longer valid.
   */
  const statefulCallClientStateListener = useCallback(
    (state: CallClientState): void => {
      if (statefulCallClient) {
        const endedIncomingCalls = Object.keys(state.incomingCallsEnded);
        setIncomingCalls(incomingCalls.filter((call) => !endedIncomingCalls.includes(call.id)));
      }
    },
    [statefulCallClient, incomingCalls]
  );

  // Examples for Callback functions for utilizing incomingCall reject and accept.
  const onRejectCall = (incomingCall: IncomingCall | TeamsIncomingCall): void => {
    if (incomingCall && /* @conditional-compile-remove(one-to-n-calling) */ callAgent) {
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
    if (incomingCall && /* @conditional-compile-remove(one-to-n-calling) */ callAgent) {
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
  }, [statefulCallClient, statefulCallClientStateListener]);

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
      /* @conditional-compile-remove(one-to-n-calling) */
      (callAgent as DeclarativeTeamsCallAgent).on('incomingCall', teamsIncomingCallListener);
      return () => {
        /* @conditional-compile-remove(one-to-n-calling) */
        (callAgent as DeclarativeTeamsCallAgent).off('incomingCall', teamsIncomingCallListener);
        /* @conditional-compile-remove(one-to-n-calling) */
        (callAgent as DeclarativeTeamsCallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else if (callAgent.kind === 'CallAgent') {
      console.log('subscribing to ACS CallAgent events');
      /* @conditional-compile-remove(one-to-n-calling) */
      (callAgent as DeclarativeCallAgent).on('incomingCall', incomingAcsCallListener);
      /* @conditional-compile-remove(one-to-n-calling) */
      (callAgent as DeclarativeCallAgent).on('callsUpdated', callsUpdatedListener);
      return () => {
        /* @conditional-compile-remove(one-to-n-calling) */
        (callAgent as DeclarativeCallAgent).off('incomingCall', incomingAcsCallListener);
        /* @conditional-compile-remove(one-to-n-calling) */
        (callAgent as DeclarativeCallAgent).off('callsUpdated', callsUpdatedListener);
      };
    } else {
      throw new Error('Unknown call agent kind');
    }
  }, [
    /* @conditional-compile-remove(one-to-n-calling) */ callAgent,
    call,
    callsUpdatedListener,
    /* @conditional-compile-remove(one-to-n-calling) */ incomingAcsCallListener,
    /* @conditional-compile-remove(one-to-n-calling) */ teamsIncomingCallListener
  ]);

  if (userCredentialFetchError) {
    return <Text>Failed to fetch user credentials</Text>;
  }

  if (statefulCallClient === undefined || /* @conditional-compile-remove(one-to-n-calling) */ callAgent === undefined) {
    return (
      <LoginScreen
        onSetStatefulClient={setStatefulCallClient}
        /* @conditional-compile-remove(one-to-n-calling) */
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
        {
          /* @conditional-compile-remove(one-to-n-calling) */ statefulCallClient && callAgent && !call && (
            <HomeScreen callAgent={callAgent as CallAgent} headerImageProps={imageProps}></HomeScreen>
          )
        }
        {statefulCallClient && /* @conditional-compile-remove(one-to-n-calling) */ callAgent && call && (
          <CallScreen
            statefulCallClient={statefulCallClient}
            /* @conditional-compile-remove(one-to-n-calling) */ callAgent={callAgent}
            /* @conditional-compile-remove(one-to-n-calling) */ call={call}
            /* @conditional-compile-remove(one-to-n-calling) */ onSetCall={setCall}
          />
        )}
        <IncomingCallManager incomingCalls={incomingCalls} onAcceptCall={onAcceptCall} onRejectCall={onRejectCall} />
      </Stack>
    </FluentThemeProvider>
  );
}

export default App;