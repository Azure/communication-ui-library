// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider, LocalizationProvider, locales } from '@azure/communication-react';
import { initializeIcons, loadTheme } from '@fluentui/react';
import { Anchor, DocsContainer } from '@storybook/addon-docs/blocks';
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
        <DocsContainer context={props.context}>
          <Anchor storyId={props.context.id} />
          {props.children}
        </DocsContainer>
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
  const themeName = context.globals.theme as string;
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

const withLocalization = (Story: any, context: any) => {
  const localeKey = context.globals.locale as string;

  return (
    <LocalizationProvider locale={locales[localeKey].locale} >
      <Story {...context} />
    </LocalizationProvider>
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

export const decorators = [withKnobs, withCenterStory, withThemeProvider, withLocalization];

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
  },
  locale: {
    name: 'Locale',
    description: 'Locale for components',
    defaultValue: 'en-US',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en-US', title: 'English' },
        { value: 'de', title: 'German' },
        { value: 'ar', title: 'Arabic' }
      ],
    },
  }
};
