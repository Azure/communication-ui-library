// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from './app/theming/SwitchableFluentThemeProvider';

ReactDOM.render(
  <SwitchableFluentThemeProvider scopeId="SampleCallingApp">
    <div className="wrapper">
      <App />
    </div>
  </SwitchableFluentThemeProvider>,
  document.getElementById('root')
);
