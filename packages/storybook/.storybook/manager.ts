import { create } from '@storybook/theming';
import { addons } from '@storybook/addons';
import { initTelemetry } from './telemetry';

initTelemetry();

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Azure Communication Services - UI Toolkit'
  })
});
