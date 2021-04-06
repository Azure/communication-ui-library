// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { withKnobs } from '@storybook/addon-knobs';
import { FluentThemeProvider, LIGHT, DARK, THEMES } from '@azure/communication-ui';
import { initializeIcons, loadTheme, mergeStyles } from '@fluentui/react';
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
      order: ['Introduction', 'Use Cases', 'Quickstart: UI Components', 'Quickstart: Composites',  'Styling', 'Theming', 'Localization', 'Composites', 'UI Components']
    }
  }
};

const withThemeProvider = (Story: any, context: any) => {
  const themeName = context.globals.theme;
  const theme = THEMES[themeName];

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
    defaultValue: LIGHT,
    toolbar: {
      icon: 'paintbrush',
      items: [LIGHT, DARK]
    }
  }
};
