// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useTheme } from '@fluentui/react';
import { ArrowDownload24Filled, Open24Filled, Pin24Regular, Share24Regular } from '@fluentui/react-icons';
import { AttachmentMetadata } from '@internal/acs-ui-common';
import { _AttachmentCard as AttachmentCardComponent, AttachmentMenuAction } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { FluentV9ThemeProvider } from '../../../../react-components/src/theming/FluentV9ThemeProvider';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';

const AttachmentCardStory = (args: {
  attachment: { id: any; name: any; extension: any; url: any };
  progress: any;
  menuActions: AttachmentMenuAction[];
}): JSX.Element => {
  const theme = useTheme();
  return (
    <FluentV9ThemeProvider v8Theme={theme}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <AttachmentCardComponent
          attachment={{
            id: args.attachment.id,
            name: args.attachment.name,
            url: args.attachment.url,
            progress: args.progress
          }}
          menuActions={args.menuActions}
        />
      </div>
    </FluentV9ThemeProvider>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const AttachmentCard = AttachmentCardStory.bind({});

const attachment: AttachmentMetadata = {
  id: '42839hdwe-dfr2-323fcfwe',
  name: 'SampleAttachmentName.pdf',
  url: 'https://www.bing.com'
};

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-attachmentcard`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Attachment Card`,
  component: AttachmentCardComponent,
  argTypes: {
    isDownload: { control: 'boolean', defaultValue: true },
    attachment: { control: 'object', defaultValue: attachment },
    progress: { control: 'number', defaultValue: 0.5 },
    // Hiding auto-generated controls
    menuActions: {
      control: 'object',
      defaultValue: [
        {
          name: 'Open',
          icon: <Open24Filled />,
          onClick: () => {
            window.open(attachment.url);
          }
        },
        {
          name: 'Download',
          icon: <ArrowDownload24Filled />,
          onClick: () => {
            window.alert(`Downloading ${attachment.name}`);
          }
        },
        {
          name: 'Share',
          icon: <Share24Regular />,
          onClick: () => {
            window.alert(`sharing ${attachment.name}`);
          }
        },
        {
          name: 'Pin',
          icon: <Pin24Regular />,
          onClick: () => {
            window.alert(`pinning ${attachment.name}`);
          }
        }
      ]
    }
  }
} as Meta;
