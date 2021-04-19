// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Source, Title, SourceState } from '@storybook/addon-docs/blocks';
import React from 'react';
import { ScreenShareLayoutExample } from './snippets/ScreenShareLayout.snippet';
import { OneToOneCallLayoutExample } from './snippets/OneToOneCallLayout.snippet';

const ScreenShareLayoutExampleText = require('!!raw-loader!./snippets/ScreenShareLayout.snippet.tsx').default;
const OneToOneCallLayoutExampleText = require('!!raw-loader!./snippets/OneToOneCallLayout.snippet.tsx').default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Layouts</Title>
      <Description>
        In this section, we showcase different examples of building your own calling gallery layouts using `VideoTile`
        component from `@azure/communication-ui` package and `@fluentui/react` package.
      </Description>
      <Description>
        In these examples, we use [Stack](https://developer.microsoft.com/en-us/fluentui#/controls/web/stack) component
        from `fluentui` to build a layout for our video tiles. For the individual elements in this layout we use
        `VideoTile` from `@azure/communication-ui` to render each participant. We are not passing in video stream to the
        `VideoTile` component in these examples, instead a
        [Persona](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona) component is used as a
        placeholder component.
      </Description>

      <Heading>OneToOne Call Layout</Heading>
      <Canvas withSource={SourceState.NONE}>
        <OneToOneCallLayoutExample />
      </Canvas>
      <Source code={OneToOneCallLayoutExampleText} />

      <Heading>Screenshare Layout</Heading>
      <Canvas withSource={SourceState.NONE}>
        <ScreenShareLayoutExample />
      </Canvas>
      <Source code={ScreenShareLayoutExampleText} />
      <Description>
        In the example above, we show a layout containing 30% of side panel on the left and 70% screen share stream on
        the right. To customize the proportion of the side panel, you can change the `width` of the side panel component
        and the screen share component will take the rest of the width automatically.
      </Description>
      <Description>
        For the individual video tile in the side panel, it has aspect ratio `16:9`. To customize the aspect ratio of
        the video tile, you can change the `paddingTop` field in the `aspectRatioBoxStyle` to be the ratio you want.
      </Description>
    </>
  );
};
