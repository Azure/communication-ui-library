// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from './app/theming/SwitchableFluentThemeProvider';
import { SwitchableLocalizationProvider } from './app/localization/SwitchableLocalizationProvider';
import { locales } from 'react-components';

ReactDOM.render(
  <SwitchableFluentThemeProvider scopeId="SampleCallingApp">
    <SwitchableLocalizationProvider storage={localStorage} selectedLocale="en-US" locales={locales}>
      <div className="wrapper">
        <App />
      </div>
    </SwitchableLocalizationProvider>
  </SwitchableFluentThemeProvider>,
  document.getElementById('root')
);
