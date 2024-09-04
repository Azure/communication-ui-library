// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { BreakoutRoomsEventData, Call, CallAgent, Features } from '@azure/communication-calling';
import { ChatThreadClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  CallAgentProvider,
  CallClientProvider,
  CallProvider,
  ChatClientProvider,
  ChatThreadClientProvider,
  createStatefulCallClient,
  createStatefulChatClient,
  DEFAULT_COMPONENT_ICONS,
  FluentThemeProvider,
  StatefulCallClient,
  StatefulChatClient
} from '@azure/communication-react';
import { initializeIcons, registerIcons, Stack } from '@fluentui/react';
import React, { useCallback, useEffect, useState } from 'react';
import CallingComponents from './components/CallingComponents';
import ChatComponents from './components/ChatComponents';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function App(): JSX.Element {
  const userAccessToken = '<Azure Communication Services Resource Access Token>';
  const userId = '<User Id associated to the token>';
  const meetingLink = '<Meeting link>';
  const displayName = '<Display Name>';
  const endpointUrl = '<Azure Communication Services Resource Endpoint>';

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();
  // Main meeting call is used to return to the main meeting from a breakout room
  const [mainMeetingCall, setMainMeetingCall] = useState<Call>();

  const [chatClient, setChatClient] = useState<StatefulChatClient>();
  const [chatThreadClient, setChatThreadClient] = useState<ChatThreadClient>();
  const [threadId, setThreadId] = useState<string>();

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

    // set up chat client
    const chatClient = createStatefulChatClient({
      credential: tokenCredential,
      userId: { communicationUserId: userId },
      displayName,
      endpoint: endpointUrl
    });
    // start realtime notification
    chatClient.startRealtimeNotifications();
    setChatClient(chatClient);
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
            setThreadId(call.info.threadId);
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
    [call, setCall, mainMeetingCall, returnToMainMeeting, setThreadId]
  );

  useEffect(() => {
    if (call) {
      // Subscribe to breakout rooms updated events
      call.feature(Features.BreakoutRooms)?.on('breakoutRoomsUpdated', onBreakoutRoomsUpdated);
      // Subscribe to state change event to track threadId
      call.on('stateChanged', () => {
        if (call.info.threadId && call.info.threadId !== threadId) {
          setThreadId(call.info.threadId);
        }
      });
    }
  }, [call, onBreakoutRoomsUpdated, threadId, setThreadId]);

  // Set chat thread client when threadId changes
  useEffect(() => {
    if (chatClient && threadId) {
      setChatThreadClient(chatClient.getChatThreadClient(threadId));
    }
  }, [threadId, chatClient, chatThreadClient]);

  return (
    <FluentThemeProvider>
      <Stack horizontal style={{ width: '100%', height: '100%' }}>
        {statefulCallClient && (
          <Stack style={{ width: '100%', height: '100%' }}>
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
          </Stack>
        )}
        {call?.state === 'Connected' && chatClient && chatThreadClient && (
          <Stack style={{ width: '20rem' }}>
            <ChatClientProvider chatClient={chatClient}>
              <ChatThreadClientProvider chatThreadClient={chatThreadClient}>
                <ChatComponents />
              </ChatThreadClientProvider>
            </ChatClientProvider>
          </Stack>
        )}
      </Stack>
    </FluentThemeProvider>
  );
}

export default App;
