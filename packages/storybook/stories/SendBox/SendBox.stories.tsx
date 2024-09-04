// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SendBox as SendBoxComponent } from '@azure/communication-react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect } from 'react';
import { DetailedBetaBanner } from '../BetaBanners/DetailedBetaBanner';

import { SingleLineBetaBanner } from '../BetaBanners/SingleLineBetaBanner';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { AttachmentUploadsExample } from './snippets/AttachmentUploads.snippet';
import { CustomIconExample } from './snippets/CustomIcon.snippet';
import { CustomStylingExample } from './snippets/CustomStyling.snippet';
import { MentionsExample } from './snippets/Mentions.snippet';
import { SendBoxExample } from './snippets/SendBox.snippet';
import { SendBoxWithSystemMessageExample } from './snippets/SendBoxWithSystemMessage.snippet';

const AttachmentUploadsExampleText = require('!!raw-loader!./snippets/AttachmentUploads.snippet.tsx').default;
const CustomIconExampleText = require('!!raw-loader!./snippets/CustomIcon.snippet.tsx').default;
const CustomStylingExampleText = require('!!raw-loader!./snippets/CustomStyling.snippet.tsx').default;
const MentionsExampleText = require('!!raw-loader!./snippets/Mentions.snippet.tsx').default;
const SendBoxExampleText = require('!!raw-loader!./snippets/SendBox.snippet.tsx').default;
const SendBoxWithSystemMessageExampleText =
  require('!!raw-loader!./snippets/SendBoxWithSystemMessage.snippet.tsx').default;

const importStatement = `import { SendBox } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>SendBox</Title>
      <Description>
        Component for typing and sending messages. SendBox has a callback for sending typing notification when user
        starts entering text. It also supports an optional message below the text input field.
      </Description>

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={SendBoxExampleText}>
        <SendBoxExample />
      </Canvas>

      <Heading>Add a system message</Heading>
      <Description>To add a system message, use the systemMessage property like in the example below.</Description>
      <Canvas mdxSource={SendBoxWithSystemMessageExampleText}>
        <SendBoxWithSystemMessageExample />
      </Canvas>

      <Heading>Customize send icon</Heading>
      <Description>
        To customize the send icon, use the `onRenderIcon` property like in the example below. A Fluent UI
        [Icon](https://developer.microsoft.com/fluentui#/controls/web/icon) is used in this example but you can use any
        `JSX.Element`.
      </Description>
      <Canvas mdxSource={CustomIconExampleText}>
        <CustomIconExample />
      </Canvas>

      <Heading>Customize styling</Heading>
      <Description>
        To customize the style of SendBox, use the `styles` property like in the example below. Notice that the keys of
        `styles` property are the root and sub-components of `SendBox`, each of which can be styled independently.
      </Description>
      <Canvas mdxSource={CustomStylingExampleText}>
        <CustomStylingExample />
      </Canvas>

      <Heading>Display Attachment Uploads</Heading>
      <DetailedBetaBanner />
      <Description>
        SendBox component provides UI for displaying AttachmentMetadataInProgress in the SendBox. This allows developers
        to implement a file sharing feature using the pure UI component with minimal effort. Developers can write their
        own attachment upload logic and utilize the UI provided by SendBox.
      </Description>
      <Canvas mdxSource={AttachmentUploadsExampleText}>
        <AttachmentUploadsExample />
      </Canvas>

      <Heading>Mentioning Users</Heading>
      <SingleLineBetaBanner version={'1.7.0-beta.1'} />
      <Description>
        The SendBox component supports mentioning users in the chat. To enable this feature, set the
        `mentionLookupOptions` property to an object and implement the required functionality.
      </Description>

      <Canvas mdxSource={MentionsExampleText}>
        <MentionsExample />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={SendBoxComponent} />
    </>
  );
};

const SendBoxStory = (args): JSX.Element => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;

  useEffect(() => {
    return () => {
      timeoutRef.current && clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div style={{ width: '31.25rem' }}>
      <SendBoxComponent
        disabled={args.disabled}
        onSendMessage={async (message, options) => {
          timeoutRef.current = setTimeout(() => {
            alert(`sent message: "${message}" with options ${JSON.stringify(options)}`);
          }, delayForSendButton);
        }}
        onTyping={(): Promise<void> => {
          console.log(`sending typing notifications`);
          return Promise.resolve();
        }}
        systemMessage={args.hasWarning ? args.warningMessage : undefined}
        attachments={
          args.hasAttachments
            ? [{ id: 'f2d1fce73c98', name: 'file1.txt', progress: 1, url: 'https://www.bing.com' }]
            : undefined
        }
        onCancelAttachmentUpload={(attachmentId) => {
          window.alert(`onCancelAttachmentUpload callback is called for attachment id: "${attachmentId}"`);
        }}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const SendBox = SendBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-sendbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Send Box/Send Box`,
  component: SendBoxComponent,
  argTypes: {
    // hide unnecessary props from storybook controls
    // since we now have `hasAttachments` for attachments
    attachments: hiddenControl,
    onCancelAttachmentUpload: hiddenControl,
    onRenderAttachmentUploads: hiddenControl,
    disabled: controlsToAdd.disabled,
    hasWarning: controlsToAdd.isSendBoxWithWarning,
    warningMessage: controlsToAdd.sendBoxWarningMessage,
    hasAttachments: controlsToAdd.isSendBoxWithAttachments,
    // Hiding auto-generated controls
    systemMessage: hiddenControl,
    onSendMessage: hiddenControl,
    onTyping: hiddenControl,
    onRenderSystemMessage: hiddenControl,
    supportNewline: hiddenControl,
    onRenderIcon: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
