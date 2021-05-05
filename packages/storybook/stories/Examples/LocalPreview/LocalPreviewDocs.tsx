import React from 'react';
import { Title, Heading, Description, Canvas, Source } from '@storybook/addon-docs/blocks';
import { LocalPreviewExample } from './snippets/LocalPreview.snippet';

const LocalPreviewExampleText = require('!!raw-loader!./snippets/LocalPreview.snippet.tsx').default;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>Local Preview</Title>

      <Heading>Basic example</Heading>
      <Description>
        To build a local preview, we recommend using the Fluent UI
        [Stack](https://developer.microsoft.com/en-us/fluentui#/controls/web/stack) as a container like shown in the
        code below. For enabling/disabling the camera or microphone we suggest using the
        [Toggle](https://developer.microsoft.com/en-us/fluentui#/controls/web/toggle) component. The area for showing
        your local preview is a [VideoTile](./?path=/docs/ui-components-videotile--video-tile-component) which can also
        be used in our video grid layouts.
      </Description>
      <Source code={LocalPreviewExampleText} />
      <Canvas withSource="none">
        <LocalPreviewExample isVideoReady={true} isCameraEnabled={true} isMicrophoneEnabled={true} />
      </Canvas>
    </>
  );
};
