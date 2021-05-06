//Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { FluentThemeProvider } from 'react-components';

ReactDOM.render(
  <FluentThemeProvider>
    <App />
  </FluentThemeProvider>,
  document.getElementById('root')
);
