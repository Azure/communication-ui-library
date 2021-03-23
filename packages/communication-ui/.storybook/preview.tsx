// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider } from '../src/providers/FluentThemeProvider';
import { LIGHT, DARK, THEMES } from '../src/constants/themes';
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
  const themeName = context.globals.theme;
  const theme = THEMES[themeName];
  if (themeName === DARK) {
    document.body.style.background = '#070707';
  } else if (themeName === LIGHT) {
    document.body.style.background = '#ffffff';
  }

  return (
    <FluentThemeProvider fluentTheme={theme}>
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
    defaultValue: LIGHT,
    toolbar: {
      icon: 'paintbrush',
      items: [LIGHT, DARK]
    }
  }
};
