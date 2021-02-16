// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { boolean, number, object, text } from '@storybook/addon-knobs';
import { MediaGalleryComponent as MediaGallery } from '../components';
import { LocalVideoContainerOwnProps, RemoteVideoContainerOwnProps, VideoContainerProps } from '../consumers';
import { MediaStreamType } from '@azure/communication-calling';
import { renderVideoStream } from './utils';
import { getDocs } from './docs/MediaGalleryDocs';
import {
  mediaGalleryWidthDefault,
  mediaGalleryWidthOptions,
  mediaGalleryHeightDefault,
  mediaGalleryHeightOptions,
  COMPONENT_FOLDER_PREFIX
} from './constants';

export const MediaGalleryComponent: () => JSX.Element = () => {
  const localParticipantLabel = text('Local Participant Label', 'Local');
  const localVideoStream = boolean('Turn Local Video On', false);
  const width = number('Width', mediaGalleryWidthDefault, mediaGalleryWidthOptions);
  const height = number('Height', mediaGalleryHeightDefault, mediaGalleryHeightOptions);

  const defaultRemoteParticipants = [
    {
      displayName: 'Remote1',
      videoStream: {
        id: 1,
        type: 'Video' as MediaStreamType,
        isAvailable: false,
        on: () => {
          return;
        },
        off: () => {
          return;
        }
      }
    },
    {
      displayName: 'Remote2',
      videoStream: {
        id: 2,
        type: 'Video' as MediaStreamType,
        isAvailable: false,
        on: () => {
          return;
        },
        off: () => {
          return;
        }
      }
    }
  ];

  const remoteParticipants = object('Remote Participants', defaultRemoteParticipants);

  return (
    <div
      style={{
        height: `${height}px`,
        width: `${width}px`
      }}
    >
      <MediaGallery
        localParticipantLabel={localParticipantLabel}
        remoteParticipants={remoteParticipants}
        connectLocalMediaGalleryTileWithData={(ownProps: LocalVideoContainerOwnProps): VideoContainerProps => {
          const videoStreamElement = localVideoStream ? renderVideoStream(ownProps.scalingMode) : null;
          return {
            isVideoReady: localVideoStream,
            videoStreamElement: videoStreamElement
          };
        }}
        connectRemoteMediaGalleryTileWithData={(ownProps: RemoteVideoContainerOwnProps): VideoContainerProps => {
          const isVideoReady = ownProps.stream?.isAvailable ?? false;
          const videoStreamElement = ownProps.stream ? renderVideoStream(ownProps.scalingMode) : null;
          return {
            isVideoReady: isVideoReady,
            videoStreamElement: videoStreamElement
          };
        }}
      />
    </div>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/MediaGallery`,
  component: MediaGallery,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
