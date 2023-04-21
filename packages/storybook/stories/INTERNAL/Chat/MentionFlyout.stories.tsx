// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  _MentionFlyout as MentionFlyoutComponent,
  _MentionFlyoutProps,
  _DrawerMenuStyles
} from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';

const MentionFlyoutStory: (args) => JSX.Element = (args) => {
  return <MentionFlyoutComponent {...args.mentionLookupOptions} title={args.title} suggestions={args.suggestions} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const MentionFlyout = MentionFlyoutStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-MentionFlyout`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Chat/MentionFlyout`,
  component: MentionFlyoutComponent,
  argTypes: {
    suggestions: controlsToAdd.mentionSuggestions,
    title: { ...controlsToAdd.title }
  }
} as Meta;
