// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import {
  DEFAULT_COMPONENT_ICONS,
  DeclarativeMediaSessionAgent,
  FluentThemeProvider,
  MediaClientProvider,
  MediaSessionAgentProvider,
  MediaStreamSessionProvider,
  createStatefulMediaClient,
  StatefulMediaClient
} from '@azure/communication-react';
import { Stack, Text, initializeIcons, registerIcons } from '@fluentui/react';
import { SessionScreen } from './views/SessionScreen';
import { HomeScreen } from './views/HomeScreen';
import { MediaStreamSession } from '@skype/spool-sdk';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

const SESSION_ID = 'SESSION_ID';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

function AppContent(): JSX.Element {
  const [error, setError] = useState<string>();
  const [statefulMediaClient, setStatefulMediaClient] = useState<StatefulMediaClient>();
  const [mediaSessionAgent, setMediaSessionAgent] = useState<DeclarativeMediaSessionAgent>();
  const [mediaStreamSession, setMediaStreamSession] = useState<MediaStreamSession>();

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  if (statefulMediaClient === undefined || mediaSessionAgent === undefined || mediaStreamSession === undefined) {
    return (
      <HomeScreen
        onStartClick={async () => {
          try {
            let credentials: {
              userId: string;
              token: string;
            };
            try {
              credentials = await fetchTokenResponse();
            } catch (e) {
              console.error('Failed to fetch user credentials', e);
              setError('Failed to fetch user credentials');
              return;
            }

            const mediaClient = createStatefulMediaClient({ userId: { communicationUserId: credentials.userId } });
            setStatefulMediaClient(mediaClient);

            const deviceManager = await mediaClient.getDeviceManager();
            await deviceManager.askDevicePermission({
              audio: true,
              video: true
            });
            await Promise.all([
              deviceManager.getMicrophones(),
              deviceManager.getSpeakers(),
              deviceManager.getCameras()
            ]);

            const sessionAgent = await mediaClient.createSessionAgent(
              new AzureCommunicationTokenCredential(credentials.token)
            );
            setMediaSessionAgent(sessionAgent);

            const streamSession = await sessionAgent.joinSession(SESSION_ID);
            setMediaStreamSession(streamSession);
          } catch (e) {
            console.error(e);
            setError('Failed to start session');
          }
        }}
      />
    );
  }

  return (
    <FluentThemeProvider>
      <MediaClientProvider mediaClient={statefulMediaClient}>
        <MediaSessionAgentProvider mediaSessionAgent={mediaSessionAgent}>
          <MediaStreamSessionProvider session={mediaStreamSession}>
            <SessionScreen />
          </MediaStreamSessionProvider>
        </MediaSessionAgentProvider>
      </MediaClientProvider>
    </FluentThemeProvider>
  );
}

const App = (): JSX.Element => {
  return (
    <Stack horizontalAlign="center" verticalFill verticalAlign="center" id="app">
      <AppContent />
    </Stack>
  );
};

export default App;

export const fetchTokenResponse = async (): Promise<{
  userId: string;
  token: string;
}> => {
  const response = await fetch('token');
  if (response.ok) {
    const responseAsJson = await response.json();
    const token = responseAsJson.token;
    if (token) {
      return responseAsJson;
    }
  }
  throw 'Invalid token response';
};
