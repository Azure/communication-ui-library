// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { EXAMPLES_FOLDER_PREFIX } from '../../constants';
import { MessageWithFile as MessageWithFileComponent } from '../../MessageThread/snippets/MessageWithFile.snippet';
import { getDocs } from './TeamsInteropDocs';

const MessageWithFileStory: (args) => JSX.Element = (args) => {
  return <MessageWithFileComponent {...args} />;
};

export const FileSharing = MessageWithFileStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-teamsinterop-fileSharing`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Teams Interop/File Sharing`,
  component: FileSharing,
  argTypes: {},
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
