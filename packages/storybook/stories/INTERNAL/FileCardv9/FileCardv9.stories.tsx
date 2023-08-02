// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import { Dismiss20Regular } from '@fluentui/react-icons';
import { _FileCard } from '@internal/react-components-v2';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const FileCardStory = (args): JSX.Element => {
  return (
    <FluentProvider theme={webLightTheme}>
      <_FileCard
        actionIcon={<Dismiss20Regular />}
        fileName={args.fileName}
        fileExtension={args.fileExtension}
        progress={args.progress}
      />
    </FluentProvider>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const FileCardv9 = FileCardStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-filecard-v9`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/File Card v9`,
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
  },
  parameters: {
    storyshots: { disable: true }
  }
} as Meta;
