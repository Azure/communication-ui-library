import React from 'react';

import { create } from '@storybook/theming';
import { addons, types } from '@storybook/manager-api';
import { initTelemetry } from './telemetry';
import { TextDirectionToolTip } from './TextDirectionToolTip';
import { initializeIcons, loadTheme, registerIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
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
registerIcons({ icons: { ...storyIcons} });

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
  addons.add('toolbar-addon/textDirection', {
    title: 'Theme',
    //👇 Sets the type of UI element in Storybook
    type: types.TOOL,
    //👇 Shows the Toolbar UI element only when Canvas tab is active.
    match: ({ viewMode, storyId }) => !!(viewMode && viewMode.match(/^(story)$/)),
    render: ({ active }) => <TextDirectionToolTip active={active} />
  });
});