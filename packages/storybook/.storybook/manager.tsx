import { create } from '@storybook/theming';
import addons, { types } from '@storybook/addons';
import React from 'react';
import { ThemeToolTipWithPanel } from './ThemeToolTipWithPanel';
import { initTelemetry } from './telemetry';

initTelemetry();

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Azure Communication Services - UI Library',
    brandImage: './images/logo.svg'
  }),
  enableShortcuts: false
});

addons.register('toolbar', () => {
  addons.add('toolbar-addon/theme', {
    title: 'Theme',
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element only when Canvas tab is active. Also excluding it from teams theme story.
    match: ({ viewMode, storyId }) => !!(viewMode && viewMode.match(/^(story)$/)) && !!(storyId && !storyId.match(/(teams-theme-component)$/)),
    render: ({ active }) => <ThemeToolTipWithPanel active={active} />
  });
});
