// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { SendBox as SendBoxComponent } from '@internal/react-components-v2';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs';
import { Meta } from '@storybook/react/types-6-0';
import React, { useEffect } from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../constants';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { SendBoxExamplev9 } from './snippets/SendBoxv9.snippet';

const SendBoxExampleText = require('!!raw-loader!./snippets/SendBoxv9.snippet.tsx').default;
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
        <SendBoxExamplev9 />
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
        onSubmit={(message) => {
          timeoutRef.current = setTimeout(() => {
            alert(`sent message: ${message} `);
          }, delayForSendButton);
        }}
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
  id: `${COMPONENT_FOLDER_PREFIX}-internal-sendbox-v9`,
  title: `${COMPONENT_FOLDER_PREFIX}/Internal/Send Box v9`,
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
