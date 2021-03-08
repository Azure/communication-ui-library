// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { number, object } from '@storybook/addon-knobs';
import { getDocs } from './docs/GridLayoutDocs';
import {
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions,
  COMPONENT_FOLDER_PREFIX
} from './constants';
import { GridLayoutComponent as GridLayout, VideoTile, StreamMedia } from '../components';
import { renderVideoStream } from './utils';

export const GridLayoutComponent: () => JSX.Element = () => {
  const width = number('Width', mediaGalleryWidthDefault, mediaGalleryWidthOptions);
  const height = number('Height', mediaGalleryHeightDefault, mediaGalleryHeightOptions);

  const defaultParticipants = [
    {
      displayName: 'Michael',
      isVideoReady: false
    },
    {
      displayName: 'Jim',
      isVideoReady: false
    },
    {
      displayName: 'Pam',
      isVideoReady: false
    },
    {
      displayName: 'Dweight',
      isVideoReady: false
    }
  ];

  const participants = object('Participants', defaultParticipants);

  const participantsComponents = participants.map((participant, index) => {
    return (
      <VideoTile
        isVideoReady={participant.isVideoReady}
        videoProvider={<StreamMedia videoStreamElement={participant.isVideoReady ? renderVideoStream() : null} />}
        avatarName={participant.displayName}
        key={index}
      >
        <label>{participant.displayName}</label>
      </VideoTile>
    );
  });

  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`
      }}
    >
      <GridLayout>{participantsComponents}</GridLayout>
    </div>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/GridLayout`,
  component: GridLayout,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
