// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
// import App from './app/App';
// import { SwitchableFluentThemeProvider } from './app/theming/SwitchableFluentThemeProvider';
// import { ShakeToSendLogs } from './app/utils/ShakeToSendLogs';
import { connect, disconnect } from './wb-init';
import { Mic28Regular, MicOff28Regular } from '@fluentui/react-icons';
import { mergeStyles, useTheme } from '@fluentui/react';

// console.log(something);

// connect();

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('Failed to find the root element');
}

const App = (): JSX.Element => {
  const [connectState, setConnectState] = React.useState<'disconnected' | 'connecting' | 'connected' | 'disconnecting'>(
    'disconnected'
  );

  console.log('Current State:', connectState);

  const theme = useTheme();
  const buttonDisabled: boolean = connectState === 'connecting' || connectState === 'disconnecting';

  const buttonStyle = mergeStyles({
    width: '100px',
    height: '100px',
    fontSize: '16px',
    backgroundColor: buttonDisabled ? 'gray' : theme.palette.themePrimary,
    color: 'white',
    border: 'none',
    borderRadius: '100%',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: buttonDisabled ? 'gray' : theme.palette.themeDark
    }
  });

  const connectToCommunication = async (): Promise<void> => {
    try {
      console.log('Connecting to communication');
      setConnectState('connecting');
      await connect();
      setConnectState('connected');
    } catch {
      setConnectState('disconnected');
    }
  };

  const disconnectFromCommunication = async (): Promise<void> => {
    try {
      console.log('Disconnecting from communication');
      setConnectState('disconnecting');
      await disconnect();
      setConnectState('disconnected');
    } catch {
      setConnectState('connected');
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <button
        className={buttonStyle}
        disabled={connectState !== 'disconnected' && connectState !== 'connected'}
        onClick={connectState === 'disconnected' ? connectToCommunication : disconnectFromCommunication}
      >
        {connectState === 'connected' || connectState === 'connecting' ? <Mic28Regular /> : <MicOff28Regular />}
      </button>
    </div>
  );
};

createRoot(domNode).render(
  // <SwitchableFluentThemeProvider scopeId="SampleCallingApp">
  //   <App />
  //   <ShakeToSendLogs />
  // </SwitchableFluentThemeProvider>
  <App />
);
