// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { boolean, number, text } from '@storybook/addon-knobs';
import { MediaGalleryTileComponent as MediaGalleryTile } from '../components';
import { renderVideoStream } from './utils';
import { getDocs } from './docs/MediaGalleryTileDocs';
import {
  mediaGalleryTileHeightDefault,
  mediaGalleryTileHeightOptions,
  mediaGalleryTileWidthDefault,
  mediaGalleryTileWidthOptions,
  COMPONENT_FOLDER_PREFIX
} from './constants';

export const MediaGalleryTileComponent: () => JSX.Element = () => {
  const label = text('Label', 'hello');
  const isVideoReady = boolean('is Video Ready', false);
  const width = number('Width', mediaGalleryTileWidthDefault, mediaGalleryTileWidthOptions);
  const height = number('Height', mediaGalleryTileHeightDefault, mediaGalleryTileHeightOptions);

  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`
      }}
    >
      <MediaGalleryTile
        label={label}
        isVideoReady={isVideoReady}
        videoStreamElement={isVideoReady ? renderVideoStream() : null}
      />
    </div>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/MediaGalleryTile`,
  component: MediaGalleryTile,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
