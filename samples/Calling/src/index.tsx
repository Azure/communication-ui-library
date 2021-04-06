// © Microsoft Corporation. All rights reserved.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from '@azure/communication-ui';

ReactDOM.render(
  <SwitchableFluentThemeProvider scopeId="SampleCallingApp">
    <div className="wrapper">
      <App />
    </div>
  </SwitchableFluentThemeProvider>,
  document.getElementById('root')
);
