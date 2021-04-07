// © Microsoft Corporation. All rights reserved.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from '@azure/communication-ui';

if (document.getElementById('root') !== undefined) {
  ReactDOM.render(
    <SwitchableFluentThemeProvider scopeId="SampleChatApp">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <div className="wrapper">
        <App />
      </div>
    </SwitchableFluentThemeProvider>,
    document.getElementById('root')
  );
}
