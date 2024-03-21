// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, useTheme } from '@fluentui/react';
import { _AttachmentCard } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { FluentV9ThemeProvider } from '../../../../react-components/src/theming/FluentV9ThemeProvider';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const AttachmentCardStory = (args): JSX.Element => {
  const theme = useTheme();
  return (
    <FluentV9ThemeProvider v8Theme={theme}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <_AttachmentCard
          attachmentName={args.fileName}
          attachmentExtension={args.fileExtension}
          actionIcon={<Icon iconName={args.actionIconName} />}
          progress={args.progress}
        />
      </div>
    </FluentV9ThemeProvider>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const AttachmentCard = AttachmentCardStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-attachmentcard`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Attachment Card`,
  component: _AttachmentCard,
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
