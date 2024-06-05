// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from './app/theming/SwitchableFluentThemeProvider';
import { initReactRenderTracker } from './app/utils/AppUtils';

const domNode = document.getElementById('root');
if (!domNode) {
  throw new Error('Failed to find the root element');
}

initReactRenderTracker();

createRoot(domNode).render(
  <React.StrictMode>
    <SwitchableFluentThemeProvider scopeId="SampleCallingApp">
      <div className="wrapper">
        <App />
      </div>
    </SwitchableFluentThemeProvider>
  </React.StrictMode>
);
