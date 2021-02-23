// © Microsoft Corporation. All rights reserved.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './app/App';
import { FluentThemeProvider } from '@azure/communication-ui';

export const darkTheme = {
  palette: {
    themePrimary: '#0078d4',
    themeLighterAlt: '#010801',
    themeLighter: '#021e02',
    themeLight: '#043904',
    themeTertiary: '#087108',
    themeSecondary: '#0ca60c',
    themeDarkAlt: '#20c320',
    themeDark: '#3ccd3c',
    themeDarker: '#68da68',
    neutralLighterAlt: '#666666',
    neutralLighter: '#313131',
    neutralLight: '#2f2f2f',
    neutralQuaternaryAlt: '#2c2c2c',
    neutralQuaternary: '#2a2a2a',
    neutralTertiaryAlt: '#282828',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#333333'
  }
};

ReactDOM.render(
  <FluentThemeProvider theme={darkTheme}>
    <App />
  </FluentThemeProvider>,
  document.getElementById('root')
);
