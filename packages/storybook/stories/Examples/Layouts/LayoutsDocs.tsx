// © Microsoft Corporation. All rights reserved.

import { Canvas, Description, Heading, Source, Title } from '@storybook/addon-docs/blocks';
import React from 'react';
import { ScreenShareLayoutExample } from './examples/ScreenShareLayoutExample';
import { OneToOneCallLayoutExample } from './examples/OneToOneCallLayoutExample';
import ScreenShareLayoutExampleText from '!!raw-loader!./examples/ScreenShareLayoutExample.tsx';
import OneToOneCallLayoutExampleText from '!!raw-loader!./examples/OneToOneCallLayoutExample.tsx';

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Layouts</Title>
      <Description>
        In this section, we show case different examples of building your own calling gallery layouts using `VideoTile`
        component from `@azure/communication-ui` package and `@fluentui/react` package.
      </Description>
      <Description>
        In these examples, we use [Stack](https://developer.microsoft.com/en-us/fluentui#/controls/web/stack) component
        from `fluentui` to build the overall layout. And `VideoTile` component from `@azure/communication-ui` is chosen
        to populate the layout. We're not passing in video stream to the `VideoTile` component in these examples,
        instead a [Persona](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona) component is used as a
        placeholder component. To pass in video stream to these components, you can choose to connect components with
        `ACS Declarative Client`.
      </Description>

      <Heading>OneToOne Call Layout</Heading>
      <Canvas withSource="none">
        <OneToOneCallLayoutExample />
      </Canvas>
      <Source code={OneToOneCallLayoutExampleText} />

      <Heading>Screenshare Layout</Heading>
      <Canvas withSource="none">
        <ScreenShareLayoutExample />
      </Canvas>
      <Source code={ScreenShareLayoutExampleText} />
      <Description>
        In the example above, we show a Layout containing 30% of side panel on the left and 70% screen share stream on
        the right. And the video tile in the side panel has aspect ratio `16:9`. To custimize the proportion of the side
        panel, you can change the `width` of the side panel component and the screen share component will take the rest
        of the width automatically. To custimize the aspect ratio of the video tile, change the `paddingTop` field in
        the `aspectRatioBoxStyle` to be the ratio you want.
      </Description>
    </>
  );
};
