import { create } from '@storybook/theming';
import addons, { types } from '@storybook/addons';
import React from 'react';
import { ThemeToolTipWithPanel } from './ThemeToolTipWithPanel';
import { initTelemetry } from './telemetry';
import { TextDirectionToolTip } from './TextDirectionToolTip';
import { LocaleToolTip } from './LocaleToolTip';
import { initializeIcons, loadTheme, registerIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { HandRight20Regular, Open20Regular, Record20Regular, People20Regular } from '@fluentui/react-icons';

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
initializeFileTypeIcons();
registerIcons({ icons: {...DEFAULT_COMPONENT_ICONS, ...storyIcons} });


declare let __NPM_PACKAGE_VERSION__: string; // Injected by webpack
console.log(`This Storybook was compiled for @azure/communication-react version ${__NPM_PACKAGE_VERSION__}`);

initTelemetry();

addons.setConfig({
  selectedBarPanel: 'storybook/docs',
  theme: create({
    base: 'light',
    brandTitle: 'Azure Communication Services - UI Library',
    brandImage: './images/logo.svg'
  }),
  toolbar: {
    zoom: { hidden: true },
    eject: {hidden: true },
    copy: {hidden: true },
    fullscreen: {hidden: false}
  }
});

addons.register('toolbar', () => {
  addons.add('toolbar-addon/theme', {
    title: 'Theme',
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element only when Canvas tab is active. Also excluding it from teams theme story.
    match: ({ viewMode, storyId }) => !!(viewMode && viewMode.match(/^(story)$/)) && !!(storyId && !storyId.match(/(teams-theme-component)$/)),
    render: ({ active }) => <ThemeToolTipWithPanel active={active} />
  });

  addons.add('toolbar-addon/locale', {
    title: 'Theme',
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element only when Canvas tab is active.
    match: ({ viewMode, storyId }) => !!(viewMode && viewMode.match(/^(story)$/)),
    render: ({ active }) => <LocaleToolTip active={active} />
  });

  addons.add('toolbar-addon/textDirection', {
    title: 'Theme',
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element only when Canvas tab is active.
    match: ({ viewMode, storyId }) => !!(viewMode && viewMode.match(/^(story)$/)),
    render: ({ active }) => <TextDirectionToolTip active={active} />
  });
});