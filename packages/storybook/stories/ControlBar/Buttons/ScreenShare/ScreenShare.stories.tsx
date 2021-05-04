// © Microsoft Corporation. All rights reserved.

import { ScreenShareButton } from '@azure/communication-ui';
import { Canvas, Description, Heading, Props, Source, SourceState, Title } from '@storybook/addon-docs/blocks';
import { boolean } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import { COMPONENT_FOLDER_PREFIX } from '../../../constants';
import { CustomScreenShareButtonExample } from './snippets/Custom.snippet';
import { ScreenShareButtonExample } from './snippets/Default.snippet';
import { ScreenShareButtonWithLabelExample } from './snippets/WithLabel.snippet';

const ButtonWithLabelExampleText = require('!!raw-loader!./snippets/WithLabel.snippet.tsx').default;
const CustomButtonExampleText = require('!!raw-loader!./snippets/Custom.snippet.tsx').default;
const DefaultButtonExampleText = require('!!raw-loader!./snippets/Default.snippet.tsx').default;

const importStatement = `
import { ScreenShareButton } from '@azure/communication-ui';
`;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ScreenShareButton</Title>
      <Description of={ScreenShareButton} />

      <Heading>Importing</Heading>
      <Source code={importStatement} />

      <Heading>Example</Heading>
      <Description>
        The default `ScreenShareButton` component shows a ScreenShare icon with no label. The following example displays
        an unmuted `ScreenShareButton` and a muted `ScreenShareButton`.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <ScreenShareButtonExample />
      </Canvas>
      <Source code={DefaultButtonExampleText} />

      <Heading>ScreenShare with default label</Heading>
      <Description>
        You can display the button label which, by default, will show below the icon as `Mute` or `Unmute`.
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <ScreenShareButtonWithLabelExample />
      </Canvas>
      <Source code={ButtonWithLabelExampleText} />

      <Heading>Custom ScreenShareButton Styles</Heading>
      <Description>
        You can change the styles of the `ScreenShareButton` as you would customized any Button (styles, primary,
        onRenderIcon, onRenderText, etc... ).
      </Description>
      <Canvas withSource={SourceState.NONE}>
        <CustomScreenShareButtonExample />
      </Canvas>
      <Source code={CustomButtonExampleText} />

      <Heading>ScreenShareButton Props</Heading>
      <Description>
        `ScreenShareButton` features all props a [FluentUI
        Button](https://developer.microsoft.com/en-us/fluentui#/controls/web/button) offers, with the following
        additional properties:
      </Description>
      <Props of={ScreenShareButton} />
    </>
  );
};

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ScreenShare = (): JSX.Element => {
  const toggleButtons = boolean('Toggle Buttons', false);
  const showLabels = boolean('Show Labels', false);

  return <ScreenShareButton showLabel={showLabels} checked={toggleButtons} />;
};

export default {
  // Space in the name is required to match storybook's matching with the camel case component name:
  // ScreenShare -> Screen Share
  title: `${COMPONENT_FOLDER_PREFIX}/ControlBar/Buttons/Screen Share`,
  component: ScreenShareButton,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
