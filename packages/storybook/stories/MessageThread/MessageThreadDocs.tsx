// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { MessageThread } from '@azure/communication-ui';
const ExampleConstantsText = require('!!raw-loader!./snippets/placeholdermessages.ts').default;
import { DefaultMessageThreadExample } from './snippets/MessageThreadExample.snippet';
const DefaultMessageThreadExampleText = require('!!raw-loader!./snippets/MessageThreadExample.snippet.tsx').default;
import { MessageThreadWithReadReceiptExample } from './snippets/MessageThreadWithReadReceiptExample.snippet';
const MessageThreadWithReadReceiptExampleText = require('!!raw-loader!./snippets/MessageThreadWithReadReceiptExample.snippet.tsx')
  .default;
import { MessageThreadWithCustomAvatarExample } from './snippets/MessageThreadWithCustomAvatarExample.snippet';
const MessageThreadWithCustomAvatarExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomAvatarExample.snippet.tsx')
  .default;
import { MessageThreadWithSystemMessagesExample } from './snippets/MessageThreadWithSystemMessagesExample.snippet';
const MessageThreadWithSystemMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithSystemMessagesExample.snippet.tsx')
  .default;
import { MessageThreadWithCustomMessagesExample } from './snippets/MessageThreadWithCustomMessagesExample.snippet';
const MessageThreadWithCustomMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomMessagesExample.snippet.tsx')
  .default;
import { MessageThreadWithCustomizedChatContainerExample } from './snippets/MessageThreadWithCustomizedChatContainerExample.snippet';
const MessageThreadWithCustomizedChatContainerExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomizedChatContainerExample.snippet.tsx')
  .default;
import { MessageThreadWithCustomizedMessageContainerExample } from './snippets/MessageThreadWithCustomizedMessageContainerExample.snippet';
const MessageThreadWithCustomizedMessageContainerExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomizedMessageContainerExample.snippet.tsx')
  .default;
import { MessageThreadWithCustomizedReadReceiptExample } from './snippets/MessageThreadWithCustomizedReadReceiptExample.snippet';
const MessageThreadWithCustomizedReadReceiptExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomizedReadReceiptExample.snippet.tsx')
  .default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MessageThread</Title>
      <Description of={MessageThread} />
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
        <MessageThreadWithCustomizedChatContainerExample />
      </Canvas>
      <Source code={MessageThreadWithCustomizedChatContainerExampleText} />
      <Heading>Messages with Customized Message Container</Heading>
      <Description>
        The example below shows how to render a `custom` chat container with `onRenderMessage` in `MessageThread`
      </Description>
      <Canvas>
        <MessageThreadWithCustomizedMessageContainerExample />
      </Canvas>
      <Source code={MessageThreadWithCustomizedMessageContainerExampleText} />
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
        <MessageThreadWithCustomizedReadReceiptExample />
      </Canvas>
      <Source code={MessageThreadWithCustomizedReadReceiptExampleText} />
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
