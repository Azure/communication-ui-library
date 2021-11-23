import { Call, CallAgent } from '@azure/communication-calling';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { DEFAULT_COMPONENT_ICONS, createStatefulCallClient, StatefulCallClient } from '@azure/communication-react';
import { registerIcons } from '@fluentui/react';
import React, { useEffect, useMemo, useState } from 'react';

function App(): JSX.Element {
  registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

  const userAccessToken = '<Azure Communication Services Resource Access Token>';
  const userId = '<User Id associated to the token>';
  const tokenCredential = useMemo(() => {
    return new AzureCommunicationTokenCredential(userAccessToken);
  }, [userAccessToken]);
  const groupId = '<Generated GUID groupd id>';
  const displayName = '<Display Name>';

  const [statefulCallClient, setStatefulCallClient] = useState<StatefulCallClient>();
  const [callAgent, setCallAgent] = useState<CallAgent>();
  const [call, setCall] = useState<Call>();

  useEffect(() => {
    setStatefulCallClient(
      createStatefulCallClient({
        userId: { communicationUserId: userId }
      })
    );
  }, [userId]);

  useEffect(() => {
    if (callAgent === undefined && statefulCallClient) {
      const createUserAgent = async (): Promise<void> => {
        setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName }));
      };
      createUserAgent();
    }
  }, [callAgent, statefulCallClient, tokenCredential, displayName]);

  useEffect(() => {
    if (callAgent !== undefined) {
      setCall(callAgent.join({ groupId }));
    }
  }, [callAgent]);

  return <>{statefulCallClient && callAgent && call && <h1>Hooray! You set up chat client 🎉🎉🎉</h1>}</>;
}

export default App;
