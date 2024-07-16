// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  FluentThemeProvider,
  DEFAULT_COMPONENT_ICONS,
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  createStatefulCallClient,
  StatefulCallClient
} from '@azure/communication-react';
import React, { useCallback, useEffect, useState } from 'react';
import CallingComponents from './components/CallingComponents';
import { initializeIcons, registerIcons } from '@fluentui/react';
import { Call, CallAgent, Features, TeamsCall } from '@azure/communication-calling';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  const userAccessToken =
    'eyJhbGciOiJSUzI1NiIsImtpZCI6IjYwNUVCMzFEMzBBMjBEQkRBNTMxODU2MkM4QTM2RDFCMzIyMkE2MTkiLCJ4NXQiOiJZRjZ6SFRDaURiMmxNWVZpeUtOdEd6SWlwaGsiLCJ0eXAiOiJKV1QifQ.eyJza3lwZWlkIjoiYWNzOmI2YWFkYTFmLTBiMWQtNDdhYy04NjZmLTkxYWFlMDBhMWQwMV8wMDAwMDAyMS01Mjc3LWU0ODEtMDhjOC0zZTNhMGQwMDljYTUiLCJzY3AiOjE3OTIsImNzaSI6IjE3MjA5ODMxMDkiLCJleHAiOjE3MjEwNjk1MDksInJnbiI6ImFtZXIiLCJhY3NTY29wZSI6ImNoYXQsdm9pcCIsInJlc291cmNlSWQiOiJiNmFhZGExZi0wYjFkLTQ3YWMtODY2Zi05MWFhZTAwYTFkMDEiLCJyZXNvdXJjZUxvY2F0aW9uIjoidW5pdGVkc3RhdGVzIiwiaWF0IjoxNzIwOTgzMTA5fQ.cIuIWvDddyZbTxdYHaZzFzR8l7s0VZWcCVMygfbkLpUqtPz40dmB0WFWWuiTIS5qkDnIMYjZewyhPF7n7MVjI0fFu2QnFbPvdtaNEpt5QaH73F1tz8yvJHlSpECuZGtiBL7mxMbunZ3MJLMMdWIPLfU4HLxTZLFDB1RymAGLR6jDbeqSy3FAcbLc6LdUAQjHcXGvdErQhhErXATctLhZ8sut8y58cXWvZNIciKvHRljlAicRtnW8Y4b_JkFUhFj4ZYP8m0sS0yysP-GyTCATvgH_fMtlrTx_dyWsRlbBuJGtzbJL9y4fj01J07SI82RsGElvQHHQLc6uHrsqH5syoA';
  const userId = '8:acs:b6aada1f-0b1d-47ac-866f-91aae00a1d01_00000021-5277-e481-08c8-3e3a0d009ca5';
  const meetingLink = 'https://teams.microsoft.com/meet/288407690174?p=yHs62K';
  const displayName = 'Test';

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();
  // breakout rooms
  const [mainMeetingCall, setMainMeetingCall] = useState<Call>();

  useEffect(() => {
    const statefulCallClient = createStatefulCallClient({
      userId: { communicationUserId: userId }
    });

    // Request camera and microphone access once we have access to the device manager
    statefulCallClient.getDeviceManager().then((deviceManager) => {
      deviceManager.askDevicePermission({ video: true, audio: true });
    });

    setStatefulCallClient(statefulCallClient);
  }, []);

  useEffect(() => {
    const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
    if (callAgent === undefined && statefulCallClient && displayName) {
      const createUserAgent = async () => {
        setCallAgent(
          await statefulCallClient.createCallAgent(tokenCredential, {
            displayName: displayName
          })
        );
      };
      createUserAgent();
    }
  }, [statefulCallClient, displayName, callAgent]);

  useEffect(() => {
    if (callAgent !== undefined) {
      setCall(callAgent.join({ meetingLink }));
    }
  }, [callAgent]);

  // breakout rooms
  const onBreakoutRoomJoined = useCallback(
    (breakoutRoomCall: Call | TeamsCall) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const _breakoutRoomCall = (breakoutRoomCall as any)['call'];
      if (_breakoutRoomCall) {
        setMainMeetingCall(call);
        setCall(_breakoutRoomCall);
      }
    },
    [call, setMainMeetingCall, setCall]
  );

  // breakout rooms
  const returnToMainMeeting = useCallback(async () => {
    if (mainMeetingCall) {
      setCall(mainMeetingCall);
    }
  }, [mainMeetingCall, setCall]);

  // breakout rooms
  const hangUpMainMeeting = useCallback(async () => {
    if (mainMeetingCall) {
      await mainMeetingCall.hangUp();
      setMainMeetingCall(undefined);
    }
  }, [mainMeetingCall, setMainMeetingCall]);

  // breakout rooms
  useEffect(() => {
    if (call) {
      subscribeToCallEvents(call, onBreakoutRoomJoined);
    }
  }, [call, onBreakoutRoomJoined]);

  // breakout rooms
  callAgent?.on('callsUpdated', (args: { added: Call[]; removed: Call[] }) => {
    const removedCall = args.removed.find((removedCall) => removedCall.id === call?.id);
    if (removedCall) {
      // Return to main meeting because breakout room call is ended because it is closed
      if (
        removedCall.id === call?.id &&
        mainMeetingCall?.feature(Features.BreakoutRooms).assignedBreakoutRoom?.state === 'closed'
      ) {
        returnToMainMeeting();
      }
    }
  });

  return (
    <FluentThemeProvider>
      <>
        {statefulCallClient && (
          <CallClientProvider callClient={statefulCallClient}>
            {callAgent && (
              <CallAgentProvider callAgent={callAgent}>
                {call && (
                  <CallProvider call={call}>
                    <CallingComponents
                      hangUpMainMeeting={hangUpMainMeeting}
                      returnToMainMeeting={async () => {
                        await returnToMainMeeting();
                        mainMeetingCall?.resume();
                      }}
                    />
                  </CallProvider>
                )}
              </CallAgentProvider>
            )}
          </CallClientProvider>
        )}
      </>
    </FluentThemeProvider>
  );
}

// breakout rooms
const subscribeToCallEvents = (
  call: Call | TeamsCall,
  onBreakoutRoomJoined: (breakoutRoomCall: Call | TeamsCall) => void
): void => {
  const breakoutRooms = call.feature(Features.BreakoutRooms);
  if (breakoutRooms) {
    breakoutRooms.on('breakoutRoomJoined', onBreakoutRoomJoined);
  }
};

export default App;
