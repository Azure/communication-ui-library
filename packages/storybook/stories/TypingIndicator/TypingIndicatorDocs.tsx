// © Microsoft Corporation. All rights reserved.
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import React from 'react';
import { TypingIndicator } from '@azure/react-components';
import { TypingIndicatorSnippet } from './snippets/TypingIndicator.snippet';
import { CustomStylingSnippet } from './snippets/CustomStyling.snippet';
import { CustomUserRenderSnippet } from './snippets/CustomUserRender.snippet';

const TypingIndicatorSnippetText = require('!!raw-loader!./snippets/TypingIndicator.snippet.tsx').default;
const CustomStylingSnippetText = require('!!raw-loader!./snippets/CustomStyling.snippet.tsx').default;
const CustomUserRenderSnippetText = require('!!raw-loader!./snippets/CustomUserRender.snippet.tsx').default;

const importStatement = `import { TypingIndicator } from '@azure/react-components';`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>TypingIndicator</Title>
      <Description of={TypingIndicator} />
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Source code={TypingIndicatorSnippetText} />
      <Canvas>
        <TypingIndicatorSnippet />
      </Canvas>
      <Heading>Customize style</Heading>
      <Description>
        To customize the style of `TypingIndicator`, use the `styles` property like in the example below. Notice that
        the keys of `styles` property are the root and sub-components of `TypingIndicator`, each of which can be styled
        independently.
      </Description>
      <Source code={CustomStylingSnippetText} />
      <Canvas>
        <CustomStylingSnippet />
      </Canvas>
      <Heading>Customize user rendering</Heading>
      <Description>
        To customize user rendering of `TypingIndicator`, use the `onRenderUsers` property like in the example below.
        Note when this property is assigned you must apply style directly. The `styles` property will not apply.
      </Description>
      <Source code={CustomUserRenderSnippetText} />
      <Canvas>
        <CustomUserRenderSnippet />
      </Canvas>
      <Heading>Props</Heading>
      <Props of={TypingIndicator} />
    </>
  );
};
