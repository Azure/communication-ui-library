// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { SendBox } from '@azure/communication-ui';
import { SendBoxExample } from './examples/SendBoxExample';
import SendBoxExampleText from '!!raw-loader!./examples/SendBoxExample.tsx';
import { SendBoxWithSystemMessageExample } from './examples/SendBoxWithSystemMessageExample';
import SendBoxWithSystemMessageExampleText from '!!raw-loader!./examples/SendBoxWithSystemMessageExample.tsx';
import { CustomIconExample } from './examples/CustomIconExample';
import CustomIconExampleText from '!!raw-loader!./examples/CustomIconExample.tsx';

const importStatement = `import { SendBox } from '@azure/communication-ui';`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>SendBox</Title>
      <Description of={SendBox} />
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas withSource="none">
        <SendBoxExample />
      </Canvas>
      <Source code={SendBoxExampleText} />
      <Heading>Add a system message</Heading>
      <Description>To add a system message, use the systemMessage property like in the example below.</Description>
      <Source code={SendBoxWithSystemMessageExampleText} />
      <Canvas withSource="none">
        <SendBoxWithSystemMessageExample />
      </Canvas>
      <Heading>Customize send icon</Heading>
      <Description>
        To customize the send icon, use the onRenderIcon property like in the example below. A [Fluent UI
        Icon](https://developer.microsoft.com/en-us/fluentui#/controls/web/icon) is used in this example but you can use
        any `JSX.Element`.
      </Description>
      <Source code={CustomIconExampleText} />
      <Canvas withSource="none">
        <CustomIconExample />
      </Canvas>
      <Heading>Props</Heading>
      <Props of={SendBox} />
    </>
  );
};
