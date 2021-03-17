// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider } from '../src/providers/FluentThemeProvider';
import { lightTheme, darkTheme } from '../src/constants/themes';
import { initializeIcons, loadTheme } from '@fluentui/react';

// Removing `loadTheme({})` causes storybook declaration exception.
loadTheme({});
initializeIcons();

const centerStoryStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh'
};

export const parameters = {
  layout: 'fullscreen'
};

const withThemeProvider = (Story: any, context: any) => {
  const theme = context.globals.theme === 'light' ? lightTheme : darkTheme;
  document.body.style.background = context.globals.theme === 'light' ? '#ffffff' : '#070707';

  return (
    <FluentThemeProvider theme={theme}>
      <Story {...context} />
    </FluentThemeProvider>
  );
};

const withCenterStory = (Story: any) => {
  return (
    <div style={centerStoryStyle}>
      <Story />
    </div>
  );
};

export const decorators = [withKnobs, withThemeProvider, withCenterStory];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: ['light', 'dark']
    }
  }
};
