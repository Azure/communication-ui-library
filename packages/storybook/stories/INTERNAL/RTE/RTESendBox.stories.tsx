// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RichTextSendBox as RichTextSendBoxComponent } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';

const RichTextSendBoxStory = (args): JSX.Element => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  return (
    <div style={{ width: '31.25rem', maxWidth: '90%' }}>
      <RichTextSendBoxComponent
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
export const RichTextSendBox = RichTextSendBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-richtextsendbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/RichTextSendBox`,
  component: RichTextSendBoxComponent,
  argTypes: {
    disabled: { control: 'boolean', defaultValue: false },
    systemMessage: { control: 'text', defaultValue: undefined },
    isSendBoxWithWarning: { control: 'boolean', defaultValue: false, name: 'Has warning/information message' },
    strings: hiddenControl,
    /* @conditional-compile-remove(file-sharing) */
    onRenderAttachmentUploads: hiddenControl,
    /* @conditional-compile-remove(file-sharing) */
    activeAttachmentUploads: hiddenControl,
    /* @conditional-compile-remove(file-sharing) */
    onCancelAttachmentUpload: hiddenControl,
    onSendMessage: hiddenControl
  }
} as Meta;
