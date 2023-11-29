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
  CallClientState,
  CallErrors
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
   * This state reflects the same state coming out of our stateful client.
   * When we add to this state we can do checks to see what the different errors are. should there be something
   * in there that we want to trigger a UI change for we can reference this for more information about what
   * the error is.
   */
  const [latestErrors, setLatestErrors] = useState<CallErrors>();

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
       * Here we are comparing the latest errors that are in the stateful client and storing them into our
       * own state.
       */
      if (state.latestErrors !== latestErrors) {
        setLatestErrors(state.latestErrors);
      }
    });

    setStatefulCallClient(statefulCallClient);
  }, [latestErrors, userId]);

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
