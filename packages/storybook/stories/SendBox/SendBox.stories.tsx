// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SendBox as SendBoxComponent } from '@azure/communication-react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { controlsToAdd, hiddenControl } from '../controlsUtils';
import { CustomIconExample } from './snippets/CustomIcon.snippet';
import { CustomStylingExample } from './snippets/CustomStyling.snippet';
import { SendBoxExample } from './snippets/SendBox.snippet';
import { SendBoxWithSystemMessageExample } from './snippets/SendBoxWithSystemMessage.snippet';

const CustomIconExampleText = require('!!raw-loader!./snippets/CustomIcon.snippet.tsx').default;
const CustomStylingExampleText = require('!!raw-loader!./snippets/CustomStyling.snippet.tsx').default;
const SendBoxExampleText = require('!!raw-loader!./snippets/SendBox.snippet.tsx').default;
const SendBoxWithSystemMessageExampleText =
  require('!!raw-loader!./snippets/SendBoxWithSystemMessage.snippet.tsx').default;

const importStatement = `import { SendBox } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>SendBox</Title>
      <Description of={SendBoxComponent} />

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
        [Icon](https://developer.microsoft.com//fluentui#/controls/web/icon) is used in this example but you can use any
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

      <Heading>Props</Heading>
      <Props of={SendBoxComponent} />
    </>
  );
};

const SendBoxStory = (args): JSX.Element => {
  return (
    <div style={{ width: '31.25rem' }}>
      <SendBoxComponent
        disabled={args.disabled}
        onSendMessage={async (message) => alert(`sent message: ${message} `)}
        onTyping={(): Promise<void> => {
          console.log(`sending typing notifications`);
          return Promise.resolve();
        }}
        systemMessage={args.hasWarning ? args.warningMessage : undefined}
      />
    </div>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const SendBox = SendBoxStory.bind({});

export default {
  id: `${COMPONENT_FOLDER_PREFIX}-sendbox`,
  title: `${COMPONENT_FOLDER_PREFIX}/Send Box`,
  component: SendBoxComponent,
  argTypes: {
    disabled: controlsToAdd.disabled,
    hasWarning: controlsToAdd.isSendBoxWithWarning,
    warningMessage: controlsToAdd.sendBoxWarningMessage,
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
