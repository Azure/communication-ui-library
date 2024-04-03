// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ChatMessageComponentAsRichTextEditBox as RichTextEditBoxComponent } from '@internal/react-components';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { hiddenControl } from '../../controlsUtils';
import { Title, Description, Heading, Canvas, Props } from '@storybook/addon-docs';
import { DetailedBetaBanner } from '../../BetaBanners/DetailedBetaBanner';
import { RichTextEditBoxAttachmentUploadsExample } from './snippets/RichTextEditBoxAttachmentUploads.snippet';

const RichTextEditBoxAttachmentUploadsExampleText =
  require('!!raw-loader!./snippets/RichTextEditBoxAttachmentUploads.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>RichTextEditBox</Title>
      <Description>Component for editing messages.</Description>

      <Heading>Display File Attachments</Heading>
      <DetailedBetaBanner />
      <Description>
        RichTextEditBox component provides UI for displaying attachments in the RichTextEditBox. This allows developers
        to implement a file sharing feature using the pure UI component with minimal effort. Developers can write their
        own attachment upload logic and utilize the UI provided by RichTextEditBox.
      </Description>
      <Canvas mdxSource={RichTextEditBoxAttachmentUploadsExampleText}>
        <RichTextEditBoxAttachmentUploadsExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={RichTextEditBoxComponent} />
    </>
  );
};

const RichTextEditBoxStory = (args): JSX.Element => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  return (
    <div style={{ width: '31.25rem', maxWidth: '90%' }}>
      <RichTextEditBoxComponent
        onSubmit={async (message) => {
          timeoutRef.current = setTimeout(() => {
            alert(`sent message: ${message} `);
          }, delayForSendButton);
        }}
        message={{
          messageType: 'chat',
          content: args.message,
          contentType: 'richtext/html',
          messageId: '1',
          createdOn: new Date()
        }}
        strings={{}}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const RichTextEditBox = RichTextEditBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-internal-richtexteditbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/RichTextEditBox`,
  component: RichTextEditBoxStory,
  argTypes: {
    message: { control: 'text', defaultValue: 'Hi! How are you?' },
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
