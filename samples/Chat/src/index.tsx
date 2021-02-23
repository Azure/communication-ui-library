// © Microsoft Corporation. All rights reserved.

import './index.css';

import App from './app/App';
import React from 'react';
import ReactDOM from 'react-dom';
import { FluentThemeProvider } from '@azure/communication-ui';

if (document.getElementById('root') !== undefined) {
  ReactDOM.render(
    <FluentThemeProvider>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
      <App />
    </FluentThemeProvider>,
    document.getElementById('root')
  );
}
