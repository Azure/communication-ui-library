// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from './app/theming/SwitchableFluentThemeProvider';
import { LocalizationProvider, locales } from 'react-components';

ReactDOM.render(
  <SwitchableFluentThemeProvider scopeId="SampleCallingApp">
    <LocalizationProvider initialLocale="en-US" locales={locales}>
      <div className="wrapper">
        <App />
      </div>
    </LocalizationProvider>
  </SwitchableFluentThemeProvider>,
  document.getElementById('root')
);
