// © Microsoft Corporation. All rights reserved.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { FluentThemeProvider } from '@azure/communication-ui';

ReactDOM.render(
  <FluentThemeProvider>
    <App />
  </FluentThemeProvider>,
  document.getElementById('root')
);
