// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { SwitchableFluentThemeProvider } from './app/theming/SwitchableFluentThemeProvider';
import { SwitchableLocalizationProvider } from './app/localization/SwitchableLocalizationProvider';
import { locales } from 'react-components';

if (document.getElementById('root') !== undefined) {
  ReactDOM.render(
    <SwitchableFluentThemeProvider scopeId="SampleChatApp">
      <SwitchableLocalizationProvider storage={localStorage} selectedLocale="en-US" locales={locales}>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <div className="wrapper">
          <App />
        </div>
      </SwitchableLocalizationProvider>
    </SwitchableFluentThemeProvider>,
    document.getElementById('root')
  );
}
