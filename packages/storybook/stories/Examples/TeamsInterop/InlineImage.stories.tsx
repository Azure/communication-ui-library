// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { MessageThreadWithInlineImageExample as InlineImageComponent } from '../../MessageThread/snippets/WithInlineImageMessage.snippet';
import { getInlineImageDocs } from './TeamsInteropDocs';

const InlineImageStory: (args) => JSX.Element = (args) => {
  return <InlineImageComponent {...args} />;
};

export const InlineImage = InlineImageStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-teamsinterop-inlineImage`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop/Inline Image`,
  component: InlineImage,
  argTypes: {},
  parameters: {
    docs: {
      page: () => getInlineImageDocs()
    }
  }
} as Meta;
