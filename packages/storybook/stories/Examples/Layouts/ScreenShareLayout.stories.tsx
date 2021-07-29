// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { PlaceholderProps, VideoTile } from '@azure/communication-react';
import { Stack, mergeStyles, PersonaSize, Persona } from '@fluentui/react';
import { Canvas, Description, Heading, Title } from '@storybook/addon-docs/blocks';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';

import {
  EXAMPLES_FOLDER_PREFIX,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions
} from '../../constants';

import { ScreenShareLayoutExample } from './snippets/ScreenShareLayout.snippet';

const ScreenShareLayoutExampleText = require('!!raw-loader!./snippets/ScreenShareLayout.snippet.tsx').default;

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
        Note: In the code example, all `%` characters wer replaced by their unicode value `\u0025` due to URI malformed
        issue when loading the storybook snippets
      </Description>

      <Heading>Screenshare Layout</Heading>
      <Canvas mdxSource={ScreenShareLayoutExampleText}>
        <ScreenShareLayoutExample />
      </Canvas>
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

const renderPersona = (props: PlaceholderProps): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={props.displayName}
    initialsTextColor="white"
  />
);

const renderScreenSharePlaceholder = (): JSX.Element => (
  <Stack className={mergeStyles({ height: '100%' })}>
    <Stack verticalAlign="center" horizontalAlign="center" className={mergeStyles({ height: '100%' })}>
      Your Screen Share Stream
    </Stack>
  </Stack>
);

const renderSharePersonaPlaceholder = (): JSX.Element => (
  <Persona
    styles={{ root: { margin: 'auto' } }}
    size={PersonaSize.size56}
    hidePersonaDetails={true}
    text={'Toby'}
    initialsTextColor="white"
  />
);

const MockParticipantDisplayNames = ['Michael', 'Jim', 'Pam', 'Dwight', 'Kelly', 'Ryan', 'Andy'];

const aspectRatioBoxContentStyle = mergeStyles({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
});

const videoStreamStyle = mergeStyles({
  border: '1',
  borderStyle: 'solid',
  position: 'absolute',
  bottom: '.25rem',
  right: '.25rem',
  height: '20%',
  width: '30%'
});

const ScreenShareLayoutStory: (args) => JSX.Element = (args) => {
  const aspectRatioNumberArray = args.sidePanelTileAspectRatio.split(':');
  const aspectRatio = (100 * parseInt(aspectRatioNumberArray[1])) / parseInt(aspectRatioNumberArray[0]) + '%';

  const aspectRatioBoxStyle = mergeStyles({
    borderWidth: '.063rem .063rem .025rem .063rem',
    borderStyle: 'solid',
    width: '100%',
    height: 0,
    position: 'relative',
    paddingTop: aspectRatio
  });

  const screenShareLayoutStyle = {
    height: `${args.height}px`,
    width: `${args.width}px`,
    border: '.063rem'
  };

  const participantsComponents = MockParticipantDisplayNames.map((participantDisplayName, index) => {
    return (
      <Stack className={aspectRatioBoxStyle} key={index}>
        <Stack className={aspectRatioBoxContentStyle}>
          <VideoTile isVideoReady={false} displayName={participantDisplayName} onRenderPlaceholder={renderPersona} />
        </Stack>
      </Stack>
    );
  });

  return (
    <Stack style={screenShareLayoutStyle} horizontal>
      {/* Side panel component in this layout */}
      <Stack.Item className={mergeStyles({ height: '100%', width: args.sidePanelWidthRatio })}>
        <Stack grow className={mergeStyles({ height: '100%', overflow: 'auto' })}>
          {participantsComponents}
        </Stack>
      </Stack.Item>
      {/* Screen share stream component in this layout */}
      <Stack.Item grow className={mergeStyles({ height: '100%' })}>
        {/* The screen share component that will display the screen share stream and sharer's video */}
        <VideoTile
          isVideoReady={false}
          styles={{
            overlayContainer: videoStreamStyle
          }}
          // A placeholder element for the screen share stream
          onRenderPlaceholder={renderScreenSharePlaceholder}
        >
          {/* Video component for screen sharer's stream */}
          <VideoTile
            isVideoReady={false}
            // A placeholder element for screen sharer's video stream
            onRenderPlaceholder={renderSharePersonaPlaceholder}
          />
        </VideoTile>
      </Stack.Item>
    </Stack>
  );
};

export const ScreenShareLayout = ScreenShareLayoutStory.bind({});

export default {
  id: `${EXAMPLES_FOLDER_PREFIX}-layouts-screensharelayout`,
  title: `${EXAMPLES_FOLDER_PREFIX}/Layouts/Screen Share Layout`,
  argTypes: {
    width: {
      control: {
        type: 'range',
        min: mediaGalleryWidthOptions.min,
        max: mediaGalleryWidthOptions.max,
        step: mediaGalleryWidthOptions.step
      },
      defaultValue: 850,
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
    },
    sidePanelWidthRatio: {
      control: { type: 'select', options: ['30%', '35%', '40%', '45%', '50%'] },
      defaultValue: '30%',
      name: 'Side Panel Width Ratio'
    },
    sidePanelTileAspectRatio: {
      control: { type: 'select', options: ['16:9', '3:2', '4:3', '5:9', '1:1'] },
      defaultValue: '16:9',
      name: 'Side Panel Tile Aspect Ratio (Width:Height)'
    }
  },
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
