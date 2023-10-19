// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from './app/theming/SwitchableFluentThemeProvider';
import { ShakeToSendLogs } from './app/utils/ShakeToSendLogs';

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('Failed to find the root element');
}

createRoot(domNode).render(
  <React.StrictMode>
    <SwitchableFluentThemeProvider scopeId="SampleChatApp">
      <div className="wrapper">
        <App />
        <ShakeToSendLogs />
      </div>
    </SwitchableFluentThemeProvider>
  </React.StrictMode>
);
