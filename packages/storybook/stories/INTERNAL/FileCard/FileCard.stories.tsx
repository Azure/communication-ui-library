// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon } from '@fluentui/react';
import { _FileCard } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const FileCardStory = (args): JSX.Element => {
  return (
    <_FileCard
      fileName={args.fileName}
      fileExtension={args.fileExtension}
      actionIcon={<Icon iconName={args.actionIconName} />}
      progress={args.progress}
    />
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const FileCard = FileCardStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-filecard`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/File Card`,
  component: _FileCard,
  argTypes: {
    fileName: { control: 'text', defaultValue: 'SampleFileName.pdf' },
    fileExtension: { control: 'text', defaultValue: 'pdf' },
    actionIconName: { control: 'text', defaultValue: 'CancelFileUpload' },
    progress: { control: 'number', defaultValue: 0.5 },
    // Hiding auto-generated controls
    onClick: hiddenControl,
    primaryTile: hiddenControl,
    secondaryTile: hiddenControl,
    strings: hiddenControl
  }
} as Meta;
