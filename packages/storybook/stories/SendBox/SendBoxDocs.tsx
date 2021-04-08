// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { SendBox } from '@azure/communication-ui';
import { SendBoxExample } from './examples/SendBox.example';
import { SendBoxWithSystemMessageExample } from './examples/SendBoxWithSystemMessage.example';
import { CustomIconExample } from './examples/CustomIcon.example';
import { CustomStylingExample } from './examples/CustomStyling.example';

const SendBoxExampleText = require('!!raw-loader!./examples/SendBox.example.tsx').default;
const SendBoxWithSystemMessageExampleText = require('!!raw-loader!./examples/SendBoxWithSystemMessage.example.tsx')
  .default;
const CustomIconExampleText = require('!!raw-loader!./examples/CustomIcon.example.tsx').default;
const CustomStylingExampleText = require('!!raw-loader!./examples/CustomStyling.example.tsx').default;

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
        To customize the send icon, use the `onRenderIcon` property like in the example below. A Fluent UI
        [Icon](https://developer.microsoft.com/en-us/fluentui#/controls/web/icon) is used in this example but you can
        use any `JSX.Element`.
      </Description>
      <Source code={CustomIconExampleText} />
      <Canvas withSource="none">
        <CustomIconExample />
      </Canvas>
      <Heading>Customize styling</Heading>
      <Description>
        To customize the style of SendBox, use the `styles` property like in the example below. Notice that the keys of
        `styles` property are sub-components of `SendBox`, each of which can be styled independently.
      </Description>
      <Source code={CustomStylingExampleText} />
      <Canvas withSource="none">
        <CustomStylingExample />
      </Canvas>
      <Heading>Props</Heading>
      <Props of={SendBox} />
    </>
  );
};
