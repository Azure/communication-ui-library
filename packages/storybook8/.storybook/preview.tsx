// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, LocalizationProvider } from '@azure/communication-react';
import React from 'react';

import { THEMES } from '../stories/themes';
import { LOCALES } from '../stories/locales'

export const parameters = {
  layout: 'fullscreen',
  docs: {
    toc: {
        title: 'On this page',
        headingSelector: 'h2'
      }
  },
  options: {
    storySort: {
      order: [
        'Overview',
        'Use Cases',
        'Feedback',
        'Setup',
        'Composites',
        [
          'Get Started',
          'CallWithChatComposite',
          'CallComposite',
          'ChatComposite',
          'Adapters',
          'Cross-Framework Support',
        ],
        'Components',
        [
          'Overview',
          'Get Started',
          'Video Gallery',
          'Video Tile',
          'Grid Layout',
          'Control Bar',
          'Message Thread',
          'Send Box',
          'Message Status Indicator',
          'Typing Indicator',
          'Participant Item',
          'Participant List',
        ],
        'Concepts',
        [
          'Styling',
          'Theming',
          'Icons',
          'Localization',
          'Accessibility',
          'Custom User Data Model',
          'Error Handling',
          'Best Practices',
          'Troubleshooting',
          'Identity',
          'Rooms',
          'Communication as Teams user',
          'Adhoc calling',
          'Transfer',
          'Video Effects'
        ],
        'Examples',
        [
          "Device Settings",
          "Local Preview",
          "Themes",
          "Teams Interop",
          [
            "Compliance Banner",
            "Lobby",
            "Inline Image",
          ],
          "Incoming Call Alerts"
        ],  
        'Stateful Client',
        [
          'Overview',
          'Get Started (Call)',
          'Get Started (Chat)',
          'Best Practices',
          'React Hooks',
          [
            'Setting up',
            'UsePropsFor',
            'UseSelector'
          ],
        ],
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
    } catch (e) {
      console.log('Could not parse the following theme JSON: ' + context.globals.customTheme);
    }
  }

  const rtl = context.globals.rtl as string === 'rtl';

  if (context !== undefined) {
    return (
      <FluentThemeProvider fluentTheme={theme} rtl={rtl}>
        <Story {...context} theme={theme} />
      </FluentThemeProvider>
    );
  }
  else {
    return (
      <Story {...context} />
    );
  }
};

const withLocalization = (Story: any, context: any) => {
  const localeKey = context.globals.locale as string;

  if (context !== undefined) {
    return (
      <LocalizationProvider locale={LOCALES[localeKey].locale} >
        <Story {...context} />
      </LocalizationProvider>
    );
  }
  else {
    return (
      <Story {...context} />
    );
  }
};

export const decorators = [withThemeProvider, withLocalization];

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
    defaultValue: 'en_US',
  },
  rtl: {
    name: 'RTL',
    description: 'Whether the direction of components is right-to-left or left-to-right',
    defaultValue: 'ltr'
  }
};
