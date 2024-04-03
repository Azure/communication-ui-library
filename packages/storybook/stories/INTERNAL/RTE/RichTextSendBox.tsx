// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RichTextSendBox as RichTextSendBoxComponent } from '@internal/react-components';
import { Title, Description, Props, Heading, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { DetailedBetaBanner } from '../../BetaBanners/DetailedBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { RichTextSendBoxAttachmentUploadsExample } from './snippets/RichTextSendBoxAttachmentUploads.snippet';

const RichTextSendBoxAttachmentUploadsExampleText =
  require('!!raw-loader!./snippets/RichTextSendBoxAttachmentUploads.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>RichTextSendBox</Title>
      <Description>
        Component for typing and sending messages. RichTextSendBox has a callback for sending typing notification when
        user starts entering text. It also supports an optional message below the text input field.
      </Description>

      <Heading>Display File Uploads</Heading>
      <DetailedBetaBanner />
      <Description>
        RichTextSendBox component provides UI for displaying active attachment uploads in the RichTextSendBox. This
        allows developers to implement a file sharing feature using the pure UI component with minimal effort.
        Developers can write their own attachment upload logic and utilize the UI provided by RichTextSendBox.
      </Description>
      <Canvas mdxSource={RichTextSendBoxAttachmentUploadsExampleText}>
        <RichTextSendBoxAttachmentUploadsExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={RichTextSendBoxComponent} />
    </>
  );
};

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
    /* @conditional-compile-remove(attachment-upload) */
    onRenderAttachmentUploads: hiddenControl,
    /* @conditional-compile-remove(attachment-upload) */
    activeAttachmentUploads: hiddenControl,
    /* @conditional-compile-remove(attachment-upload) */
    onCancelAttachmentUpload: hiddenControl,
    onSendMessage: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
