// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';
import { mergeThemes, Provider, teamsTheme } from '@fluentui/react-northstar';
import { withKnobs } from '@storybook/addon-knobs';
import { ThemeProvider } from '@fluentui/react-theme-provider';
import { darkTheme, lightTheme } from './themes';
import { initializeIcons, loadTheme } from '@fluentui/react';

initializeIcons();

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

const centerStoryStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh'
};

const getAdditionalStyles = (context: any): any => {
  const additionalStyles: any = {
    background: 'none'
  };
  if (context.parameters !== undefined) {
    additionalStyles.display = 'flex';
    if (context.parameters.useMaxHeightParent) {
      additionalStyles.height = '100%';
    }
    if (context.parameters.useMaxWidthParent) {
      additionalStyles.width = '100%';
    }
  }
  return additionalStyles;
};

export const parameters = {
  layout: 'fullscreen'
};

const withThemeProvider = (Story: any, context: any) => {
  const theme = context.globals.theme === 'light' ? lightTheme : darkTheme;
  return (
    <ThemeProvider theme={theme} applyTo="body" style={getAdditionalStyles(context)}>
      <Story {...context} />
    </ThemeProvider>
  );
};

const withProvider = (Story: any, context: any) => {
  return (
    <Provider theme={mergeThemes(iconTheme, teamsTheme)} style={getAdditionalStyles(context)}>
      <Story />
    </Provider>
  );
};

const withCenterStory = (Story: any) => {
  return (
    <div style={centerStoryStyle}>
      <Story />
    </div>
  );
};

export const decorators = [withProvider, withKnobs, withThemeProvider, withCenterStory];

export const globalTypes = {
  theme: {
    name: 'Theme',
    description: 'Global theme for components',
    defaultValue: 'light',
    toolbar: {
      icon: 'circlehollow',
      items: ['light', 'dark']
    }
  }
};
