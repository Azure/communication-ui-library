import { create } from '@storybook/theming';
import addons, { types } from '@storybook/addons';
import React from 'react';
import { ThemeToolTipWithPanel } from './ThemeToolTipWithPanel';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'Azure Communication Services - UI Toolkit'
  }),
  enableShortcuts: false
});

addons.register('toolbar', () => {
  addons.add('toolbar-addon/theme', {
    title: 'Theme',
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element if either the Canvas or Docs tab is active
    match: ({ viewMode }) => !!(viewMode && viewMode.match(/^(story|docs)$/)),
    render: ({ active }) => <ThemeToolTipWithPanel active={active} />
  });
});
