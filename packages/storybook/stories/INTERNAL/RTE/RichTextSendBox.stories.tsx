// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RichTextSendBox as RichTextSendBoxComponent } from '@internal/react-components';
import { Title, Description, Props, Heading, Canvas, Source } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { DetailedBetaBanner } from '../../BetaBanners/DetailedBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { RichTextSendBoxExample } from './snippets/RichTextSendBox.snippet';
import { RichTextSendBoxAttachmentUploadsExample } from './snippets/RichTextSendBoxAttachmentUploads.snippet';
import { RichTextSendBoxWithSystemMessageExample } from './snippets/RichTextSendBoxWithSystemMessage.snippet';

const RichTextSendBoxExampleText = require('!!raw-loader!./snippets/RichTextSendBox.snippet.tsx').default;
const RichTextSendBoxAttachmentUploadsExampleText =
  require('!!raw-loader!./snippets/RichTextSendBoxAttachmentUploads.snippet.tsx').default;
const RichTextSendBoxWithSystemMessageExampleText =
  require('!!raw-loader!./snippets/RichTextSendBoxWithSystemMessage.snippet.tsx').default;

const importStatement = `import { RichTextSendBox } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>RichTextSendBox</Title>
      <Description>Component for composing messages with rich text formatting.</Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={RichTextSendBoxExampleText}>
        <RichTextSendBoxExample />
      </Canvas>

      <Heading>Add a system message</Heading>
      <Description>To add a system message, use the systemMessage property like in the example below.</Description>
      <Canvas mdxSource={RichTextSendBoxWithSystemMessageExampleText}>
        <RichTextSendBoxWithSystemMessageExample />
      </Canvas>

      <Heading>Display File Uploads</Heading>
      <DetailedBetaBanner />
      <Description>
        RichTextSendBox component provides UI for displaying AttachmentMetadataWithProgress in the RichTextSendBox. This
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
    onRenderAttachmentUploads: hiddenControl,
    attachmentsWithProgress: hiddenControl,
    onCancelAttachmentUpload: hiddenControl,
    onSendMessage: hiddenControl,
    onTyping: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
