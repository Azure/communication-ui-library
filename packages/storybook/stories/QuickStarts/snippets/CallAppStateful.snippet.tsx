import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { DEFAULT_COMPONENT_ICONS, createStatefulCallClient, StatefulCallClient } from '@azure/communication-react';
import React, { useEffect, useState } from 'react';
import { registerIcons } from '@fluentui/react';
import { Call, CallAgent } from '@azure/communication-calling';

function App(): JSX.Element {
  registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

  const userAccessToken = '<Azure Communication Services Resource Access Token>';
  const userId = '<User Id associated to the token>';
  const tokenCredential = new AzureCommunicationTokenCredential(userAccessToken);
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
  }, []);

  useEffect(() => {
    if (callAgent === undefined && statefulCallClient) {
      const createUserAgent = async () => {
        setCallAgent(await statefulCallClient.createCallAgent(tokenCredential, { displayName: displayName }));
      };
      createUserAgent();
    }
  }, [statefulCallClient, tokenCredential]);

  useEffect(() => {
    if (callAgent != undefined) {
      setCall(callAgent.join({ groupId }));
    }
  }, [callAgent]);

  return <>{statefulCallClient && callAgent && call && <h1>Hooray! You set up chat client 🎉🎉🎉</h1>}</>;
}

export default App;
