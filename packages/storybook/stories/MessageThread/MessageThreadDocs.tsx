// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { MessageThread } from '@azure/communication-react';
import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { DefaultMessageThreadExample } from './snippets/MessageThread.snippet';
import { MessageThreadWithCustomAvatarExample } from './snippets/MessageThreadWithCustomAvatar.snippet';
import { MessageThreadWithCustomChatContainerExample } from './snippets/MessageThreadWithCustomChatContainer.snippet';
import { MessageThreadWithCustomMessageContainerExample } from './snippets/MessageThreadWithCustomMessageContainer.snippet';
import { MessageThreadWithCustomMessagesExample } from './snippets/MessageThreadWithCustomMessages.snippet';
import { MessageThreadWithCustomReadReceiptExample } from './snippets/MessageThreadWithCustomReadReceipt.snippet';
import { MessageThreadWithReadReceiptExample } from './snippets/MessageThreadWithReadReceipt.snippet';
import { MessageThreadWithSystemMessagesExample } from './snippets/MessageThreadWithSystemMessages.snippet';
const DefaultMessageThreadExampleText = require('!!raw-loader!./snippets/MessageThread.snippet.tsx').default;
const MessageThreadWithCustomAvatarExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomAvatar.snippet.tsx')
  .default;
const MessageThreadWithCustomChatContainerExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomChatContainer.snippet.tsx')
  .default;
const MessageThreadWithCustomMessageContainerExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomMessageContainer.snippet.tsx')
  .default;
const MessageThreadWithCustomMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomMessages.snippet.tsx')
  .default;
const MessageThreadWithCustomReadReceiptExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomReadReceipt.snippet.tsx')
  .default;
const MessageThreadWithReadReceiptExampleText = require('!!raw-loader!./snippets/MessageThreadWithReadReceipt.snippet.tsx')
  .default;
const MessageThreadWithSystemMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithSystemMessages.snippet.tsx')
  .default;
const ExampleConstantsText = require('!!raw-loader!./snippets/placeholdermessages.ts').default;

const importStatement = `
import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MessageThread</Title>
      <Description of={MessageThread} />
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Sample Messages</Heading>
      <Description>
        Create a `placeholdermessages.ts` file in the current folder you are working on. Then copy paste the code below
        into that file.
      </Description>
      <Source code={ExampleConstantsText} />
      <Heading>Default MessageThread</Heading>
      <Canvas>
        <DefaultMessageThreadExample />
      </Canvas>
      <Source code={DefaultMessageThreadExampleText} />
      <Heading>System Message</Heading>
      <Description>The example below shows a message thread with a system message.</Description>
      <Canvas>
        <MessageThreadWithSystemMessagesExample />
      </Canvas>
      <Source code={MessageThreadWithSystemMessagesExampleText} />
      <Heading>Custom Message</Heading>
      <Description>
        The example below shows how to render a `custom` message with `onRenderMessage` in `MessageThread`
      </Description>
      <Canvas>
        <MessageThreadWithCustomMessagesExample />
      </Canvas>
      <Source code={MessageThreadWithCustomMessagesExampleText} />
      <Heading>Messages with Customized Chat Container</Heading>
      <Description>
        The example below shows how to render a `custom` chat container with `styles.chatContainer` in `MessageThread`
      </Description>
      <Canvas>
        <MessageThreadWithCustomChatContainerExample />
      </Canvas>
      <Source code={MessageThreadWithCustomChatContainerExampleText} />
      <Heading>Messages with Customized Message Container</Heading>
      <Description>
        The example below shows how to render a `custom` message container with `styles.chatMessageContainer` or
        `styles.systemMessageContainer` in `MessageThread`
      </Description>
      <Canvas>
        <MessageThreadWithCustomMessageContainerExample />
      </Canvas>
      <Source code={MessageThreadWithCustomMessageContainerExampleText} />
      <Heading>Default Read Receipt</Heading>
      <Canvas>
        <MessageThreadWithReadReceiptExample />
      </Canvas>
      <Source code={MessageThreadWithReadReceiptExampleText} />
      <Heading>Cutomized Read Receipt</Heading>
      <Description>
        The example below shows how to render a `custom` read receipt with `onRenderReadReceipt` in `MessageThread`
      </Description>
      <Canvas>
        <MessageThreadWithCustomReadReceiptExample />
      </Canvas>
      <Source code={MessageThreadWithCustomReadReceiptExampleText} />
      <Heading>Customized Avatar</Heading>
      <Canvas>
        <MessageThreadWithCustomAvatarExample />
      </Canvas>
      <Source code={MessageThreadWithCustomAvatarExampleText} />
      <Description>
        Note: You can view the details of the
        [Persona](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona) component
      </Description>
      <Heading>Props</Heading>
      <Props of={MessageThread} />
    </>
  );
};
