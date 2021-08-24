// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { FluentThemeProvider, Locale, LocalizationProvider, en_US, fr_FR, ar_SA, de_DE } from '@azure/communication-react';
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

const namedLocales: Record<string, {  name: string; locale: Locale;}> = {
  'en-US': {
    locale: en_US,
    name: 'English (US)',
  },
  'fr-FR': {
    locale: fr_FR,
    name: 'French (France)',
  },
  'de-DE': {
    locale: de_DE,
    name: 'German (Germany)',
  },
  'ar-SA': {
    locale: ar_SA,
    name: 'Arabic (Saudi Arabia)',
  }
};

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
          ],
          'Adapters',
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

  const rtl = context.globals.rtl as string === 'rtl';

  return (
    <FluentThemeProvider fluentTheme={theme} rtl={rtl}>
      <Story {...context} theme={theme} />
    </FluentThemeProvider>
  );
};

const withLocalization = (Story: any, context: any) => {
  const localeKey = context.globals.locale as string;

  return (
    <LocalizationProvider locale={namedLocales[localeKey].locale} >
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

export const decorators = [withCenterStory, withThemeProvider, withLocalization];

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
      items: Object.keys(namedLocales).map((key) => ({ title: namedLocales[key].name, value: key })),
    },
  },
  rtl: {
    name: 'RTL',
    description: 'Whether the direction of components is right-to-left or left-to-right',
    defaultValue: 'ltr',
    toolbar: {
      icon: 'transfer',
      items: [
        { value: 'ltr', title: 'Left-to-right' },
        { value: 'rtl', title: 'Right-to-left' }
      ]
    }
  }
};
