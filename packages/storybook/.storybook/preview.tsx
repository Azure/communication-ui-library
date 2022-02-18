// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DEFAULT_COMPONENT_ICONS, FluentThemeProvider, LocalizationProvider } from '@azure/communication-react';
import { initializeIcons, loadTheme, registerIcons } from '@fluentui/react';
import { HandRight20Regular, Open20Regular, Record20Regular, People20Regular } from '@fluentui/react-icons';
import { Anchor, DocsContainer } from '@storybook/addon-docs/blocks';
import React from 'react';
import {
  COMPONENT_FOLDER_PREFIX,
  COMPOSITE_FOLDER_PREFIX,
  EXAMPLES_FOLDER_PREFIX,
  CONCEPTS_FOLDER_PREFIX,
  STATEFUL_CLIENT_PREFIX
} from '../stories/constants';
import { THEMES } from '../stories/themes';
import { LOCALES } from '../stories/locales'
import { TOC } from './TOC';

// icons used in stories that are not part of the default component icons
const storyIcons = {
  Open: <Open20Regular />,
  Participants: <People20Regular />,
  Record: <Record20Regular />,
  RightHand: <HandRight20Regular />
};

// Removing `loadTheme({})` causes storybook declaration exception.
loadTheme({});
initializeIcons();
registerIcons({ icons: {...DEFAULT_COMPONENT_ICONS, ...storyIcons} });

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
        'Feedback',
        COMPOSITE_FOLDER_PREFIX,
        [
          'Get Started',
          'CallComposite',
          'ChatComposite',
          'CallWithChatComposite',
          'Adapters',
          'Cross-Framework Support',
        ],
        COMPONENT_FOLDER_PREFIX,
        [
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
        CONCEPTS_FOLDER_PREFIX,
        [
          'Styling',
          'Theming',
          'Icons',
          'Localization',
          'Accessibility',
          'Custom User Data Model',
          'Error Handling',
          'Troubleshooting',
          'Identity'
        ],
        EXAMPLES_FOLDER_PREFIX,
        STATEFUL_CLIENT_PREFIX,
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
  },
  viewMode: 'docs',
  previewTabs: {
    'storybook/docs/panel': { index: -1 },
    'canvas': {
      title: 'Preview'
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
    defaultValue: 'en_US',
  },
  rtl: {
    name: 'RTL',
    description: 'Whether the direction of components is right-to-left or left-to-right',
    defaultValue: 'ltr'
  }
};
