// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { Canvas, Description, Heading, Title } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import {
  EXAMPLES_FOLDER_PREFIX,
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions
} from '../../constants';

import { OneToOneCallLayoutExample } from './snippets/OneToOneCallLayout.snippet';

const OneToOneCallLayoutExampleText = require('!!raw-loader!./snippets/OneToOneCallLayout.snippet.tsx').default;

const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Layouts</Title>
      <Description>
        In this section, we showcase different examples of building your own calling gallery layouts using `VideoTile`
        component from `@azure/communication-react` package and `@fluentui/react` package.
      </Description>
      <Description>
        In these examples, we use [Stack](https://developer.microsoft.com/en-us/fluentui#/controls/web/stack) component
        from `fluentui` to build a layout for our video tiles. For the individual elements in this layout we use
        `VideoTile` from `@azure/communication-react` to render each participant. We are not passing in video stream to
        the `VideoTile` component in these examples, instead a
        [Persona](https://developer.microsoft.com/en-us/fluentui#/controls/web/persona) component is used as a
        placeholder component.
      </Description>
      <Description>
        Note: In the code examples, all `%` characters wer replaced by their unicode value `\u0025` due to URI malformed
        issue when loading the storybook snippets
      </Description>

      <Heading>OneToOne Call Layout</Heading>
      <Canvas mdxSource={OneToOneCallLayoutExampleText}>
        <OneToOneCallLayoutExample />
      </Canvas>
    </>
  );
};

const renderPersona = (): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={'Toby'}
    initialsTextColor="white"
  />
);

const OneToOneCallLayoutStory: (args) => JSX.Element = (args) => {
  const videoStreamStyle = mergeStyles({
    border: '1',
    borderStyle: 'solid',
    position: 'absolute',
    bottom: '.25rem',
    right: '.25rem',
    height: '25%',
    width: '30%'
  });

  return (
    <Stack style={{ height: `${args.height}px`, width: `${args.width}px`, border: '1px' }} horizontal>
      {/* Video component for the other person's video stream */}
      <VideoTile
        isVideoReady={false}
        styles={{
          overlayContainer: videoStreamStyle
        }}
        displayName={'Holly'}
      >
        {/* Video component for my video stream stream */}
        <VideoTile
          isVideoReady={false}
          // A render placeholder function for my video stream
          onRenderPlaceholder={renderPersona}
        />
      </VideoTile>
    </Stack>
  );
};

export const OneToOneCallLayout = OneToOneCallLayoutStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-layouts-onetoonecalllayout`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Layouts/One To One Call Layout`,
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: mediaGalleryWidthOptions.min,
        max: mediaGalleryWidthOptions.max,
        step: mediaGalleryWidthOptions.step
      },
      defaultValue: mediaGalleryWidthDefault,
      name: 'Width (px)'
    },
    height: {
      control: {
        type: 'range',
        min: mediaGalleryHeightOptions.min,
        max: mediaGalleryHeightOptions.max,
        step: mediaGalleryHeightOptions.step
      },
      defaultValue: mediaGalleryHeightDefault,
      name: 'Height (px)'
    }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
