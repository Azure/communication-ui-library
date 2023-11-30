import { Call, CallAgent } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import {
  FluentThemeProvider,
  DEFAULT_COMPONENT_ICONS,
  CallClientProvider,
  CallAgentProvider,
  CallProvider,
  createStatefulCallClient,
  StatefulCallClient,
  CallClientState
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React, { useEffect, useState } from 'react';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

export interface CallScreenProps {
  userAccessToken: string;
  userId: string;
  groupId: string;
  displayName: string;
}

export const CallScreen = (props: CallScreenProps): JSX.Element => {
  const { userAccessToken, userId, groupId, displayName } = props;

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();

  /**
   * This state we will store the message from the latest error that was emitted.
   */
  const [latestError, setLatestError] = useState<string>();

  useEffect(() => {
    const statefulCallClient = createStatefulCallClient({
      userId: { communicationUserId: userId }
    });

    // Request camera and microphone access once we have access to the device manager
    statefulCallClient.getDeviceManager().then((deviceManager) => {
      deviceManager.askDevicePermission({ video: true, audio: true });
    });

    statefulCallClient.onStateChange((state: CallClientState) => {
      console.log(`CallClient state changed to ${state}`);
      /**
       * Here we can check against the different errors that we hold in the stateful client. To see a complete list
       * checkout the {@link CallErrors} type that we export from communication react.
       *
       * In this example we are checking for the start screenshare to fail and storing the message on failure.
       * During this event the UI can be replaced with a new screen for example showing that something failed if
       * the {@link ErrorBar} component is not being used.
       */
      if (state.latestErrors['Call.startScreenSharing']) {
        setLatestError(state.latestErrors['Call.startScreenSharing'].message);
      }
    });

    setStatefulCallClient(statefulCallClient);
  }, [call, latestError, userId]);

  useEffect(() => {
    const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
    if (callAgent === undefined && statefulCallClient && displayName) {
      const createUserAgent = async (): Promise<void> => {
        setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName }));
      };
      createUserAgent();
    }
  }, [statefulCallClient, displayName, callAgent, userAccessToken]);

  useEffect(() => {
    if (callAgent !== undefined) {
      const call = callAgent.join({ groupId });
      setCall(call);
    }
  }, [callAgent, groupId]);

  return (
    <FluentThemeProvider>
      <>
        {statefulCallClient && (
          <CallClientProvider callClient={statefulCallClient}>
            {callAgent && (
              <CallAgentProvider callAgent={callAgent}>
                {call && (
                  <CallProvider call={call}>
                    <>Your Calling Components go here</>
                  </CallProvider>
                )}
              </CallAgentProvider>
            )}
          </CallClientProvider>
        )}
      </>
    </FluentThemeProvider>
  );
};
