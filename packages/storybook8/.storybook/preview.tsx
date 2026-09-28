// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { DEFAULT_COMPONENT_ICONS, FluentThemeProvider, LocalizationProvider } from '@azure/communication-react';
import { DocsContainer } from '@storybook/addon-docs/blocks';
import React from 'react';

import { THEMES } from '../stories/themes';
import { LOCALES } from '../stories/locales'
import { initializeIcons, Link, MessageBar, MessageBarType, registerIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
initializeIcons();
initializeFileTypeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

const RetirementWarning = () => (
  <MessageBar
    messageBarType={MessageBarType.warning}
    isMultiline={true}
    styles={{ root: { marginBottom: '1rem', padding: '0.25rem 0' }, text: { lineHeight: '1.5' } }}
  >
    <strong>Azure Communication Services UI Library is being retired.</strong> We recommend that new customers do not
    onboard to the ACS UI Library. Existing customers should review the retirement timeline and guidance in the{' '}
    <Link href="https://aka.ms/acs-retirement-and-breaking-changes-guide" target="_blank" rel="noreferrer">
      Azure Communication Services retirement and breaking changes guide
    </Link>
    .
  </MessageBar>
);

const DocsPageContainer = ({ children, context }: any) => (
  <DocsContainer context={context}>
    <RetirementWarning />
    {children}
  </DocsContainer>
);

export const parameters = {
  layout: 'fullscreen',
  docs: {
    container: DocsPageContainer,
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
          [
            'Basic Example',
            'Custom Data Model Example',
            
            'Join Existing Call',
            'Join Existing Call As Teams User',
            'Theme Example',
            '1:N',
            'PSTN',
          ],
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

const withStoryPageLayout = (Story: any, context: any) => {
  if(context.viewMode === 'docs') {
    return <Story />;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh'
    }}>
      <RetirementWarning />
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
      }}>
        <Story />
      </div>
    </div>
  );
};

export const decorators = [withStoryPageLayout, withThemeProvider, withLocalization];

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
