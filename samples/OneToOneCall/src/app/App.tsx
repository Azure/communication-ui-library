// © Microsoft Corporation. All rights reserved.

import React, { useEffect, useState } from 'react';
import { initializeIcons, loadTheme, Spinner, Stack } from '@fluentui/react';
import { OneToOneCall } from '@azure/communication-ui';
import { createRandomDisplayName, fetchTokenResponse, getBuildTime, supportedBrowser } from './utils/AppUtils';

const sdkVersion = require('../../package.json').dependencies['@azure/communication-calling'];
const lastUpdated = `Last Updated ${getBuildTime()} with @azure/communication-calling:${sdkVersion}`;

loadTheme({});
initializeIcons();

const SpinnerWith: (spinnerText: string) => JSX.Element = (spinnerText: string) => (
  <Stack horizontalAlign="center" verticalAlign="center" style={{ height: '100%', width: '100%' }}>
    <Spinner label={spinnerText} ariaLive="assertive" labelPosition="top" />
  </Stack>
);

const randomName = createRandomDisplayName();

const App = (): JSX.Element => {
  const [token, setToken] = useState('');

  useEffect(() => {
    (async () => {
      const tokenResponse = await fetchTokenResponse();
      setToken(tokenResponse.token);
    })();
  }, []);

  const getContent = (): JSX.Element => {
    if (!supportedBrowser()) {
      // page === 'error'
      window.document.title = 'Unsupported browser';
      return (
        <>
          <a href="https://docs.microsoft.com/en-us/azure/communication-services/concepts/voice-video-calling/calling-sdk-features#calling-client-library-browser-support">
            Learn more
          </a>
          &nbsp;about browsers and platforms supported by the web calling sdk
        </>
      );
    }

    if (!token) {
      return SpinnerWith('Getting token from server...');
    }

    return <OneToOneCall displayName={randomName} token={token} />;
  };

  return getContent();
};

window.setTimeout(() => {
  try {
    console.log(`ACS sample group calling app: ${lastUpdated}`);
  } catch (e) {
    /* continue regardless of error */
  }
}, 0);

export default App;
