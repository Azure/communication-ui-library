// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  _AtMentionFlyout as AtMentionFlyoutComponent,
  _AtMentionFlyoutProps,
  _DrawerMenuStyles
} from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';

const AtMentionFlyoutStory: (args) => JSX.Element = (args) => {
  return (
    <AtMentionFlyoutComponent {...args.atMentionLookupOptions} title={args.title} suggestions={args.suggestions} />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const AtMentionFlyout = AtMentionFlyoutStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-AtMentionFlyout`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Chat/AtMentionFlyout`,
  component: AtMentionFlyoutComponent,
  argTypes: {
    suggestions: controlsToAdd.atMentionSuggestions,
    title: { ...controlsToAdd.title }
  }
} as Meta;
