// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { MediaStreamType } from '@azure/communication-calling';
import { VideoContainerProps, RemoteVideoContainerOwnProps } from '../../consumers';
import { MediaGallery1To1Component as MediaGallery1To1 } from '../../components';

const importStatement = `
import { MediaGallery1To1Component as MediaGallery1To1 } from '@azure/communication-ui';
// import below if you want to customize the data mapping functions to the remote and local media tile.
import { LocalVideoContainerOwnProps, RemoteVideoContainerOwnProps, VideoContainerProps } from '@azure/communication-ui';
import { MediaStreamType } from '@azure/communication-calling';
`;

const MediaGallery1To1Example: () => JSX.Element = () => {
  // Provide mock remoteParticipants for demo purpose. In normal use cases, the ACS data layer will take care of this.
  const defaultRemoteParticipant = {
    displayName: 'Remote',
    userId: 'SAMPLE',
    isReady: true,
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

  return (
    <div style={{ height: '530px', width: '830px' }}>
      <MediaGallery1To1
        localParticipantName={'Local'}
        showLocalParticipantName={false}
        localVideoStream={undefined}
        remoteParticipant={defaultRemoteParticipant}
        localVideoInverted={true}
        // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
        connectLocalMediaGalleryTileWithData={
          (/*ownProps: LocalVideoContainerOwnProps*/): VideoContainerProps => {
            return {
              isVideoReady: false,
              // Add your logic of rendering local video stream using ownProps.scalingMode
              // e.g: localVideoStreamElement: renderVideoStream(ownProps.scalingMode);
              videoStreamElement: null
            };
          }
        }
        // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
        connectRemoteMediaGalleryTileWithData={(ownProps: RemoteVideoContainerOwnProps): VideoContainerProps => {
          const isRemoteVideoReady = ownProps.stream?.isAvailable ?? false;
          return {
            isVideoReady: isRemoteVideoReady,
            // Add your logic of rendering remote video stream using ownProps.scalingMode and ownProps.stream
            // e.g: localVideoStreamElement: renderVideoStream(ownProps.scalingMode, ownProps.stream);
            videoStreamElement: null
          };
        }}
      />
    </div>
  );
};

const exampleCode = `
// Provide mock remoteParticipants for demo purpose. In normal use cases, the ACS data layer will take care of this.
const defaultRemoteParticipant = {
  displayName: 'Remote',
  isReady: true,
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

return (
  <div style={{ height: '530px', width: '830px' }}>
    <MediaGallery1To1
      localParticipantName={'Local'}
      localVideoStream={undefined}
      showLocalParticipantName={false}
      remoteParticipant={defaultRemoteParticipant}
      localVideoInverted={true}
      // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
      connectLocalMediaGalleryTileWithData={(ownProps: LocalVideoContainerOwnProps): VideoContainerProps => {
        return {
          isLocalVideoReady: false,
          // Add your logic of rendering local video stream using ownProps.scalingMode
          // e.g: localVideoStreamElement: renderVideoStream(ownProps.scalingMode);
          localVideoStreamElement: null
        };
      }}
      // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
      connectRemoteMediaGalleryTileWithData={(ownProps: RemoteVideoContainerOwnProps): VideoContainerProps => {
        const isRemoteVideoReady = ownProps.stream?.isAvailable ?? false;
        return {
          isRemoteVideoReady: isRemoteVideoReady,
          // Add your logic of rendering remote video stream using ownProps.scalingMode and ownProps.stream
          // e.g: localVideoStreamElement: renderVideoStream(ownProps.scalingMode, ownProps.stream);
          remoteVideoStreamElement: null
        };
      }}
    />
  </div>
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MediaGallery1To1</Title>
      <Description>
        The MediaGallery1To1 component displays remote participant in a 1:1 call including the user in a gallery. It
        will display participant&apos;s available stream or a static image.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <MediaGallery1To1Example />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={MediaGallery1To1} />
    </>
  );
};
