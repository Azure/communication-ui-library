// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { TypingIndicator as TypingIndicatorComponent } from '@azure/communication-react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { object, text, boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { CustomStylingSnippet } from './snippets/CustomStyling.snippet';
import { CustomUserRenderSnippet } from './snippets/CustomUserRender.snippet';
import { TypingIndicatorSnippet } from './snippets/TypingIndicator.snippet';

const CustomStylingSnippetText = require('!!raw-loader!./snippets/CustomStyling.snippet.tsx').default;
const CustomUserRenderSnippetText = require('!!raw-loader!./snippets/CustomUserRender.snippet.tsx').default;
const TypingIndicatorSnippetText = require('!!raw-loader!./snippets/TypingIndicator.snippet.tsx').default;

const importStatement = `import { TypingIndicator } from '@azure/communication-react';`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>TypingIndicator</Title>
      <Description of={TypingIndicatorComponent} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Canvas mdxSource={TypingIndicatorSnippetText}>
        <TypingIndicatorSnippet />
      </Canvas>

      <Heading>Customize style</Heading>
      <Description>
        To customize the style of `TypingIndicator`, use the `styles` property like in the example below. Notice that
        the keys of `styles` property are the root and sub-components of `TypingIndicator`, each of which can be styled
        independently.
      </Description>
      <Canvas mdxSource={CustomStylingSnippetText}>
        <CustomStylingSnippet />
      </Canvas>

      <Heading>Customize user rendering</Heading>
      <Description>
        To customize user rendering of `TypingIndicator`, use the `onRenderUsers` property like in the example below.
        Note when this property is assigned you must apply style directly. The `styles` property will not apply.
      </Description>
      <Canvas mdxSource={CustomUserRenderSnippetText}>
        <CustomUserRenderSnippet />
      </Canvas>

      <Heading>Props</Heading>
      <Props of={TypingIndicatorComponent} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const TypingIndicator: () => JSX.Element = () => {
  const typingUsers = object('Typing Users', [
    {
      userId: '1',
      displayName: 'User1'
    },
    {
      userId: '2',
      displayName: 'User2'
    }
  ]);
  const overrideTypingString = boolean('Override typing string?', false);
  const typingString = overrideTypingString ? text('Typing String', ' are typing away...') : undefined;
  return <TypingIndicatorComponent typingUsers={typingUsers} typingString={typingString} />;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Typing Indicator`,
  component: TypingIndicatorComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
