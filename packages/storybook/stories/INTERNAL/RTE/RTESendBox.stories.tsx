// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RTESendBox as RTESendBoxComponent } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const RTESendBoxStory = (args): JSX.Element => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  return (
    <div style={{ width: '31.25rem' }}>
      <RTESendBoxComponent
        disabled={args.disabled}
        systemMessage={args.isSendBoxWithWarning ? args.systemMessage : undefined}
        onSendMessage={async (message) => {
          timeoutRef.current = setTimeout(() => {
            alert(`sent message: ${message} `);
          }, delayForSendButton);
        }}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RTESendBox = RTESendBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-rtesendbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/RTESendBox`,
  component: RTESendBoxComponent,
  argTypes: {
    disabled: { control: 'boolean', defaultValue: false },
    systemMessage: { control: 'text', defaultValue: undefined },
    isSendBoxWithWarning: { control: 'boolean', defaultValue: false, name: 'Has warning/information message' },
    strings: hiddenControl,
    /* @conditional-compile-remove(file-sharing) */
    onRenderFileUploads: hiddenControl,
    /* @conditional-compile-remove(file-sharing) */
    activeFileUploads: hiddenControl,
    /* @conditional-compile-remove(file-sharing) */
    onCancelFileUpload: hiddenControl,
    onSendMessage: hiddenControl
  }
} as Meta;
