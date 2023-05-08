// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  _MentionPopover as MentionPopoverComponent,
  _MentionPopoverProps,
  _DrawerMenuStyles
} from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd } from '../../controlsUtils';

const MentionPopoverStory: (args) => JSX.Element = (args) => {
  return <MentionPopoverComponent {...args.mentionLookupOptions} title={args.title} suggestions={args.suggestions} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const MentionPopover = MentionPopoverStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-MentionPopover`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Chat/MentionPopover`,
  component: MentionPopoverComponent,
  argTypes: {
    suggestions: controlsToAdd.mentionSuggestions,
    title: { ...controlsToAdd.title }
  }
} as Meta;
