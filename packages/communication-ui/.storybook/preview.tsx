// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider } from '../src/providers/FluentThemeProvider';
import { darkTheme, lightTheme } from './themes';
import { initializeIcons, loadTheme } from '@fluentui/react';
import { addParameters } from '@storybook/react';
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
      order: ['Introduction', 'Quickstart', 'Styling', 'Composites', 'UI Components']
    }
  }
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
    defaultValue: 'light',
    toolbar: {
      icon: 'paintbrush',
      items: ['light', 'dark']
    }
  }
};
