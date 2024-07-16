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
  const userAccessToken = '<Azure Communication Services Resource Access Token>';
  const userId = '<User Id associated to the token>';
  const meetingLink = '<Meeting link>';
  const displayName = '<Display Name>';

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
