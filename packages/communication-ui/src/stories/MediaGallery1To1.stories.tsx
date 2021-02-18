// © Microsoft Corporation. All rights reserved.

import React from 'react';
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Meta } from '@storybook/react/types-6-0';
import { boolean, object, text } from '@storybook/addon-knobs';
import { MediaGallery1To1Component as MediaGallery1To1 } from '../components';
import { LocalVideoContainerOwnProps, VideoContainerProps, RemoteVideoContainerOwnProps } from '../consumers';
import { MediaStreamType } from '@azure/communication-calling';
import { renderVideoStream } from './utils';
import { getDocs } from './docs/MediaGallery1To1Docs';
import { COMPONENT_FOLDER_PREFIX } from './constants';

const mediaGallerySize = {
  height: '530px',
  width: '830px'
};

export const MediaGallery1To1Component: () => JSX.Element = () => {
  const localParticipantName = text('Local Participant Label', 'Local');
  const localVideoStream = boolean('Turn Local Video On', false);
  const localVideoInverted = boolean('Invert Local Video', false);

  const defaultRemoteParticipant = {
    displayName: 'Remote',
    userId: 'SAMPLE',
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
  };

  const remoteParticipant = object('Remote Participant', defaultRemoteParticipant);

  return (
    <div style={mediaGallerySize}>
      <MediaGallery1To1
        localParticipantName={localParticipantName}
        localVideoStream={undefined}
        remoteParticipant={remoteParticipant}
        localVideoInverted={localVideoInverted}
        connectLocalMediaGalleryTileWithData={(ownProps: LocalVideoContainerOwnProps): VideoContainerProps => {
          const localVideoStreamElement = localVideoStream ? renderVideoStream(ownProps.scalingMode) : null;
          return {
            isVideoReady: localVideoStream,
            videoStreamElement: localVideoStreamElement
          };
        }}
        connectRemoteMediaGalleryTileWithData={(ownProps: RemoteVideoContainerOwnProps): VideoContainerProps => {
          const isRemoteVideoReady = ownProps.stream?.isAvailable ?? false;
          const remoteVideoStreamElement = ownProps.stream ? renderVideoStream(ownProps.scalingMode) : null;
          return {
            isVideoReady: isRemoteVideoReady,
            videoStreamElement: remoteVideoStreamElement
          };
        }}
      />
    </div>
  );
};

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/MediaGallery1To1`,
  component: MediaGallery1To1Component,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;
