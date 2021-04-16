// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { MessageThread } from '@azure/communication-ui';
const ExampleConstantsText = require('!!raw-loader!./examples/placeholdermessages.ts').default;
import { DefaultMessageThreadExample } from './examples/MessageThread.example';
const DefaultMessageThreadExampleText = require('!!raw-loader!./examples/MessageThread.example.tsx').default;
import { MessageThreadWithReadReceiptExample } from './examples/MessageThreadWithReadReceipt.example';
const MessageThreadWithReadReceiptExampleText = require('!!raw-loader!./examples/MessageThreadWithReadReceipt.example.tsx')
  .default;
import { MessageThreadWithCustomAvatarExample } from './examples/MessageThreadWithCustomAvatar.example';
const MessageThreadWithCustomAvatarExampleText = require('!!raw-loader!./examples/MessageThreadWithCustomAvatar.example.tsx')
  .default;
import { MessageThreadWithSystemMessagesExample } from './examples/MessageThreadWithSystemMessages.example';
const MessageThreadWithSystemMessagesExampleText = require('!!raw-loader!./examples/MessageThreadWithSystemMessages.example.tsx')
  .default;
import { MessageThreadWithCustomMessagesExample } from './examples/MessageThreadWithCustomMessages.example';
const MessageThreadWithCustomMessagesExampleText = require('!!raw-loader!./examples/MessageThreadWithCustomMessages.example.tsx')
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
        The example below shows how to render a `custom` message with `onRenderCustomMessage` in `MessageThread`
      </Description>
      <Canvas>
        <MessageThreadWithCustomMessagesExample />
      </Canvas>
      <Source code={MessageThreadWithCustomMessagesExampleText} />
      <Heading>Read Receipt</Heading>
      <Canvas>
        <MessageThreadWithReadReceiptExample />
      </Canvas>
      <Source code={MessageThreadWithReadReceiptExampleText} />
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
