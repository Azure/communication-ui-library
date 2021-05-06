// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Props, Source, SourceState, Title } from '@storybook/addon-docs/blocks';
import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { CameraButton } from '@azure/communication-react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { CustomCameraButtonExample } from './snippets/Custom.snippet';
import { CameraButtonExample } from './snippets/Default.snippet';
import { CameraButtonWithLabelExample } from './snippets/WithLabel.snippet';

const ButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;
const CustomButtonExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const DefaultButtonExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;

const importStatement = `
import { CameraButton } from '@azure/communication-ui';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>CameraButton</Title>
      <Description of={CameraButton} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `CameraButton` component shows a Camera icon with no label. The following example displays the
        `CameraButton` with camera turned on and off.
      </Description>
      <Canvas withSource={SourceState.NONE as any}>
        <CameraButtonExample />
      </Canvas>
      <Source code={DefaultButtonExampleText} />

      <Heading>Camera with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Turn on` or `Turn off`.
      </Description>
      <Canvas withSource={SourceState.NONE as any}>
        <CameraButtonWithLabelExample />
      </Canvas>
      <Source code={ButtonWithLabelExampleText} />

      <Heading>Custom CameraButton Styles</Heading>
      <Description>
        You can change the styles of the `CameraButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas withSource={SourceState.NONE as any}>
        <CustomCameraButtonExample />
      </Canvas>
      <Source code={CustomButtonExampleText} />

      <Heading>CameraButton Props</Heading>
      <Description>
        `CameraButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the following
        additional properties:
      </Description>
      <Props of={CameraButton} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const Camera = (): JSX.Element => {
  const toggleButtons = boolean('Toggle Buttons', false);
  const showLabels = boolean('Show Labels', false);

  return <CameraButton showLabel={showLabels} checked={toggleButtons} />;
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Camera`,
  component: CameraButton,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
