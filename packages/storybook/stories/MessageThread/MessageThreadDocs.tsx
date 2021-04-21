// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { MessageThread } from '@azure/communication-ui';
const ExampleConstantsText = require('!!raw-loader!./snippets/placeholdermessages.ts').default;
import { DefaultMessageThreadExample } from './snippets/MessageThread.snippet';
const DefaultMessageThreadExampleText = require('!!raw-loader!./snippets/MessageThread.snippet.tsx').default;
import { MessageThreadWithReadReceiptExample } from './snippets/MessageThreadWithReadReceipt.snippet';
const MessageThreadWithReadReceiptExampleText = require('!!raw-loader!./snippets/MessageThreadWithReadReceipt.snippet.tsx')
  .default;
import { MessageThreadWithCustomAvatarExample } from './snippets/MessageThreadWithCustomAvatar.snippet';
const MessageThreadWithCustomAvatarExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomAvatar.snippet.tsx')
  .default;
import { MessageThreadWithSystemMessagesExample } from './snippets/MessageThreadWithSystemMessages.snippet';
const MessageThreadWithSystemMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithSystemMessages.snippet.tsx')
  .default;
import { MessageThreadWithCustomMessagesExample } from './snippets/MessageThreadWithCustomMessages.snippet';
const MessageThreadWithCustomMessagesExampleText = require('!!raw-loader!./snippets/MessageThreadWithCustomMessages.snippet.tsx')
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
