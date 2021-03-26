// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider } from '../src/providers/FluentThemeProvider';
import { LIGHT, DARK, THEMES } from '../src/constants/themes';
import { initializeIcons, loadTheme } from '@fluentui/react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import { BackToTop, TableOfContents } from 'storybook-docs-toc';

// Removing `loadTheme({})` causes storybook declaration exception.
loadTheme({});
initializeIcons();

export const parameters = {
  layout: 'fullscreen',
  docs: {
    container: props => (
      <React.Fragment>
        <TableOfContents />
        <DocsContainer {...props} />
        <BackToTop />
      </React.Fragment>
    ),          
  },
  options: {
    storySort: {
      order: ['Introduction', 'Use Cases', 'Quickstart: UI Components', 'Quickstart: Composites',  'Styling', 'Theming', 'Localization', 'Composites', 'UI Components']
    }
  }
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
