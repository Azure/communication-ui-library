// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, SourceState, Title } from '@storybook/addon-docs/blocks';
import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { Stack } from '@fluentui/react';
import { OptionsButton } from 'react-components';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { OptionsButtonExample } from './snippets/OptionsButton.snippet';
import { OptionsButtonWithLabelExample } from './snippets/OptionsButtonWithLabel.snippet';
import { CustomOptionsButtonExample } from './snippets/CustomOptionsButton.snippet';

const OptionsButtonExampleText = require('!!raw-loader!./snippets/OptionsButton.snippet.tsx').default;
const OptionsButtonWithLabelExampleText = require('!!raw-loader!./snippets/OptionsButtonWithLabel.snippet.tsx').default;
const CustomOptionsButtonExampleText = require('!!raw-loader!./snippets/CustomOptionsButton.snippet.tsx').default;

const importStatement = `
import { OptionsButton } from 'react-components';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>OptionsButton</Title>
      <Description of={OptionsButton} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `OptionsButton` component shows an horizontal `More` icon with no label as in the example below.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <OptionsButtonExample />
      </Canvas>
      <Source code={OptionsButtonExampleText} />

      <Heading>OptionsButton with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Options`.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <OptionsButtonWithLabelExample />
      </Canvas>
      <Source code={OptionsButtonWithLabelExampleText} />

      <Heading>Custom OptionsButton Styles</Heading>
      <Description>
        You can change the styles of the `OptionsButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <CustomOptionsButtonExample />
      </Canvas>
      <Source code={CustomOptionsButtonExampleText} />

      <Heading>OptionsButton Props</Heading>
      <Description>
        `OptionsButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the additional
        following properties.
      </Description>
      <Props of={OptionsButton} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Options = (): JSX.Element => {
  const showLabels = boolean('Show Labels', false);

  return (
    <Stack horizontal horizontalAlign={'center'} style={{ zoom: '1.5' }}>
      <OptionsButton showLabel={showLabels} />
    </Stack>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Options`,
  component: OptionsButton,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
