// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { RichTextSendBox as RichTextSendBoxComponent } from '@azure/communication-react';
import { Title, Description, Props, Heading, Canvas, Source } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { DetailedBetaBanner } from '../BetaBanners/DetailedBetaBanner';
import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { hiddenControl, controlsToAdd } from '../controlsUtils';
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
      <SingleLineBetaBanner topOfPage={true} />
      <Title>RichTextSendBox</Title>
      <Description>
        Component for composing messages with rich text formatting. RichTextSendBox has a callback for sending typing
        notification when user starts entering text. It also supports an optional message above the rich text editor.
      </Description>

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
        RichTextSendBox component provides UI for displaying AttachmentMetadataInProgress in the RichTextSendBox. This
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
        textOnly={args.textOnly}
        attachments={
          args.hasAttachments
            ? [
                {
                  id: 'f2d1fce73c98',
                  name: 'file1.txt',
                  url: 'https://www.contoso.com/file1.txt',
                  progress: 1
                },
                {
                  id: 'dc3a33ebd321',
                  name: 'file2.docx',
                  url: 'https://www.contoso.com/file2.txt',
                  progress: 1
                }
              ]
            : undefined
        }
        systemMessage={args.hasWarning ? args.warningMessage : undefined}
        onSendMessage={async (message, options) => {
          timeoutRef.current = setTimeout(() => {
            alert(`sent message: ${message} with options ${JSON.stringify(options)}`);
          }, delayForSendButton);
        }}
        onCancelAttachmentUpload={(attachmentId) => {
          window.alert(`requested to cancel attachment upload for attachment with id: "${attachmentId}"`);
        }}
        onTyping={(): Promise<void> => {
          console.log(`sending typing notifications`);
          return Promise.resolve();
        }}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RichTextSendBox = RichTextSendBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-richtextsendbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Send Box/Rich Text Send Box`,
  component: RichTextSendBoxComponent,
  argTypes: {
    disabled: controlsToAdd.disabled,
    hasWarning: controlsToAdd.isSendBoxWithWarning,
    hasAttachments: controlsToAdd.isSendBoxWithAttachments,
    warningMessage: controlsToAdd.sendBoxWarningMessage,
    textOnly: controlsToAdd.textOnlyMode,
    strings: hiddenControl,
    onRenderAttachmentUploads: hiddenControl,
    attachments: hiddenControl,
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
