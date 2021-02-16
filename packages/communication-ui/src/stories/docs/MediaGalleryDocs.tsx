// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { MediaStreamType } from '@azure/communication-calling';
import { RemoteVideoContainerOwnProps, LocalVideoContainerOwnProps, VideoContainerProps } from '../../consumers';
import { MediaGalleryComponent as MediaGallery } from '../../components';

const importStatement = `
import { MediaGalleryComponent as MediaGallery } from '@azure/acs-ui-sdk';
// import below if you want to customize the data mapping functions to the remote and local media tile.
import { LocalVideoContainerOwnProps, LocalVideoContainerProps } from '@azure/acs-ui-sdk';
import { LocalVideoContainerOwnProps, RemoteVideoContainerOwnProps, VideoContainerProps } '@azure/acs-ui-sdk';
import { MediaStreamType } from '@azure/communication-calling';
`;

const MediaGalleryExample: () => JSX.Element = () => {
  // Provide mock remoteParticipants for demo purpose. In normal use cases, the ACS data layer will take care of this.
  const defaultRemoteParticipants = [
    {
      displayName: 'Remote1',
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
    },
    {
      displayName: 'Remote2',
      isReady: true,
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

  return (
    <div style={{ height: '530px', width: '830px' }}>
      <MediaGallery
        localParticipantLabel={'Local'}
        remoteParticipants={defaultRemoteParticipants}
        // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
        connectLocalMediaGalleryTileWithData={(ownProps: LocalVideoContainerOwnProps): VideoContainerProps => {
          return {
            isVideoReady: false,
            // Add your logic of rendering local video stream using ownProps.scalingMode
            // e.g: videoStreamElement: renderVideoStream(ownProps.scalingMode);
            videoStreamElement: null
          };
        }}
        // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
        connectRemoteMediaGalleryTileWithData={(ownProps: RemoteVideoContainerOwnProps): VideoContainerProps => {
          const isVideoReady = ownProps.stream?.isAvailable ?? false;
          return {
            isVideoReady: isVideoReady,
            // Add your logic of rendering remote video stream using ownProps.scalingMode and ownProps.stream
            // e.g: videoStreamElement: renderVideoStream(ownProps.scalingMode, ownProps.stream);
            videoStreamElement: null
          };
        }}
      />
    </div>
  );
};

const exampleCode = `
// Provide mock remoteParticipants for demo purpose. In normal use cases, the ACS data layer will take care of this.
const defaultRemoteParticipants = [
  {
    displayName: 'Remote1',
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
  },
  {
    displayName: 'Remote2',
    isReady: true,
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

return (
  <div style={{ height: '530px', width: '830px' }}>
    <MediaGallery
      localParticipantLabel={'Local'}
      remoteParticipants={defaultRemoteParticipants}
      // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
      connectLocalMediaGalleryTileWithData={(ownProps: LocalVideoContainerOwnProps): VideoContainerProps => {
        return {
          isVideoReady: false,
          // Add your logic of rendering local video stream using ownProps.scalingMode
          // e.g: videoStreamElement: renderVideoStream(ownProps.scalingMode);
          videoStreamElement: null
        };
      }}
      // Provide an optional customized connection for demo purpose. In normal use cases, the ACS data layer will take care of this.
      connectRemoteMediaGalleryTileWithData={(ownProps: RemoteVideoContainerOwnProps): VideoContainerProps => {
        const isVideoReady = ownProps.stream?.isAvailable ?? false;
        return {
          isVideoReady: isVideoReady,
          // Add your logic of rendering remote video stream using ownProps.scalingMode and ownProps.stream
          // e.g: videoStreamElement: renderVideoStream(ownProps.scalingMode, ownProps.stream);
          videoStreamElement: null
        };
      }}
    />
  </div>
);
`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>MediaGallery</Title>
      <Description>
        The MediaGallery component displays all participants in a call including the user in a gallery. Each tile will
        display participant's available stream or a static image.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <MediaGalleryExample />
      </Canvas>
      <Source code={exampleCode} />
      <Heading>Props</Heading>
      <Props of={MediaGallery} />
    </>
  );
};
