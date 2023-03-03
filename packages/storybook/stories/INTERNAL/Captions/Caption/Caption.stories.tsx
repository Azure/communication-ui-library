// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { _Caption } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { hiddenControl } from '../../../controlsUtils';

const CaptionStory = (args): JSX.Element => {
  return <_Caption userId={args.userId} displayName={args.displayName} caption={args.caption} />;
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Caption = CaptionStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-Caption`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Captions/Caption`,
  component: _Caption,
  argTypes: {
    userId: { control: 'text', defaultValue: 'abcd' },
    displayName: { control: 'text', defaultValue: 'Caroline' },
    caption: { control: 'text', defaultValue: 'Hello there' },
    onRenderAvatar: hiddenControl
  }
} as Meta;
