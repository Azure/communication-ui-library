import { create } from '@storybook/theming';
import addons, { types } from '@storybook/addons';
import React from 'react';
import { ThemeToolTipWithPanel } from './ThemeToolTipWithPanel';
import { initTelemetry } from './telemetry';

declare let __NPM_PACKAGE_VERSION__: string; // Injected by webpack
console.log(`This Storybook was compiled for @azure/communication-react version ${__NPM_PACKAGE_VERSION__}`);

initTelemetry();

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Azure Communication Services - UI Library',
    brandImage: './images/logo.svg'
  }),
  enableShortcuts: false,
  toolbar: {
    zoom: { hidden: true },
    'storybook/viewport': { hidden: true }
  }
});
