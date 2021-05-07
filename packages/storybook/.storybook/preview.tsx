// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider, defaultThemes } from '@azure/communication-react';
import { initializeIcons, loadTheme, mergeStyles } from '@fluentui/react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { BackToTop, TableOfContents } from 'storybook-docs-toc';
import {
  COMPONENT_FOLDER_PREFIX,
  COMPOSITE_FOLDER_PREFIX,
  EXAMPLES_FOLDER_PREFIX,
  QUICKSTARTS_FOLDER_PREFIX,
  STATEFUL_CLIENT_PREFIX
} from '../stories/constants';

// Removing `loadTheme({})` causes storybook declaration exception.
loadTheme({});
initializeIcons();

const THEMES = defaultThemes;

export const parameters = {
  layout: 'fullscreen',
  docs: {
    container: props => (
      <React.Fragment>
        <div className={mergeStyles({'& nav': { right: 0 }})}>
          <TableOfContents />
        </div>
        <DocsContainer {...props} />
        <div className={mergeStyles({'> button': { right: 0 }})}>
          <BackToTop />
        </div>
      </React.Fragment>
    ),
  },
  options: {
    storySort: {
      order: [
        'Introduction',
        'Use Cases',
        'Styling',
        'Theming',
        'Localization',
        QUICKSTARTS_FOLDER_PREFIX,
        COMPOSITE_FOLDER_PREFIX,
        EXAMPLES_FOLDER_PREFIX,
        COMPONENT_FOLDER_PREFIX,
        STATEFUL_CLIENT_PREFIX,
        [
          'What is it',
          'Best Practices',
          'Handlers',
          'Selectors',
          'FAQ',
          'Reference'
        ]
      ]
    }
  }
};

const withThemeProvider = (Story: any, context: any) => {
  const themeName = (context.globals.theme as string).toLowerCase();
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
    defaultValue: defaultThemes.light.name
  },
  customTheme: {
    name: 'Custom theme',
    description: 'Custom global theme for components',
    defaultValue: ''
  }
};
