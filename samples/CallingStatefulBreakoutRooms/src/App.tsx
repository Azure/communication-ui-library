// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BreakoutRoomsEventData, Call, CallAgent, Features } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  createStatefulCallClient,
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  StatefulCallClient
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import CallingComponents from './components/CallingComponents';

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
  // Main meeting call is used to return to the main meeting from a breakout room
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
      const call = callAgent.join({ meetingLink });
      setCall(call);
      // Set call as main meeting to return to from a breakout room
      setMainMeetingCall(call);
    }
  }, [callAgent]);

  // Function to return to the main meeting from a breakout room
  const returnToMainMeeting = useCallback(async () => {
    if (mainMeetingCall) {
      setCall(mainMeetingCall);
      if (mainMeetingCall.state === 'LocalHold') {
        mainMeetingCall.resume();
      }
    }
  }, [mainMeetingCall, setCall]);

  // Breakout rooms update event handler
  const onBreakoutRoomsUpdated = useCallback(
    (eventData: BreakoutRoomsEventData) => {
      if (eventData.type === 'join') {
        // This case covers the scenario when the user joins a breakout room.
        const breakoutRoomCall = eventData.data as Call;
        setCall(breakoutRoomCall);
      } else if (eventData.type === 'assignedBreakoutRooms') {
        const breakoutRoom = eventData.data;
        const assignedBreakoutRoom = mainMeetingCall?.feature(Features.BreakoutRooms).assignedBreakoutRooms;
        if (breakoutRoom?.state === 'open') {
          if (assignedBreakoutRoom && assignedBreakoutRoom.call && assignedBreakoutRoom.call.id !== call?.id) {
            // This case covers the scenario when the user is re-assigned to another breakout room that is open.
            const call = assignedBreakoutRoom.call as Call;
            setCall(call);
          }
        } else {
          if (assignedBreakoutRoom?.call) {
            if (assignedBreakoutRoom.call.id !== call?.id) {
              // This case covers the scenario when the user is re-assigned breakout room that is closed.
              returnToMainMeeting();
            }
          } else {
            // This case covers the scenario when the user is assigned breakout room that is closed or
            // when the user is unassigned from a breakout room.
            returnToMainMeeting();
          }
        }
      }
    },
    [call, setCall, mainMeetingCall, returnToMainMeeting]
  );

  useEffect(() => {
    if (call) {
      // Subscribe to breakout rooms updated events
      call.feature(Features.BreakoutRooms)?.on('breakoutRoomsUpdated', onBreakoutRoomsUpdated);
    }
  }, [call, onBreakoutRoomsUpdated]);

  return (
    <FluentThemeProvider>
      <>
        {statefulCallClient && (
          <CallClientProvider callClient={statefulCallClient}>
            {callAgent && (
              <CallAgentProvider callAgent={callAgent}>
                {call && (
                  <CallProvider call={call}>
                    <CallingComponents returnToMainMeeting={returnToMainMeeting} />
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

export default App;
