// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider } from '@azure/communication-react';
import { initializeIcons, loadTheme } from '@fluentui/react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { TOC } from './TOC';
import {
  COMPONENT_FOLDER_PREFIX,
  COMPOSITE_FOLDER_PREFIX,
  EXAMPLES_FOLDER_PREFIX,
  QUICKSTARTS_FOLDER_PREFIX,
  STATEFUL_CLIENT_PREFIX
} from '../stories/constants';
import { THEMES } from '../stories/themes';

// Removing `loadTheme({})` causes storybook declaration exception.
loadTheme({});
initializeIcons();

export const parameters = {
  layout: 'fullscreen',
  docs: {
    container: props => (
      <TOC>
        <DocsContainer {...props} />
      </TOC>
    ),
  },
  options: {
    storySort: {
      order: [
        'Overview',
        'Use Cases',
        'Styling',
        'Theming',
        'Localization',
        'Accessibility',
        'Custom User Data Model',
        'Feedback',
        STATEFUL_CLIENT_PREFIX,
        [
          'Overview',
          'Best Practices',
          'React Hooks',
          [
            'Setting up',
            'UsePropsFor',
            'UseSelector'
          ]
        ],
        QUICKSTARTS_FOLDER_PREFIX,
        COMPOSITE_FOLDER_PREFIX,
        COMPONENT_FOLDER_PREFIX,
        EXAMPLES_FOLDER_PREFIX
      ]
    }
  }
};

const withThemeProvider = (Story: any, context: any) => {
  const themeName = context.globals.theme;
  let theme = THEMES[themeName]?.theme;
  if (context.globals.customTheme) {
    try {
      theme = JSON.parse(context.globals.customTheme);
    } catch(e) {
      console.log('Could not parse the following theme JSON: ' + context.globals.customTheme);
    }
  }

  return (
    <FluentThemeProvider fluentTheme={theme}>
      <Story {...context} />
    </FluentThemeProvider>
  );
};

const withCenterStory = (Story: any) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <Story />
    </div>
  );
};

export const decorators = [withKnobs, withCenterStory, withThemeProvider];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: THEMES.Light.name
  },
  customTheme: {
    name: 'Custom theme',
    description: 'Custom global theme for components',
    defaultValue: ''
  }
};
