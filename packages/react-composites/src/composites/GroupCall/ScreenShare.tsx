// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { loadingStyle, videoStreamStyle } from './styles/ScreenShare.styles';

import { connectFuncsToContext } from '../../consumers';
import { MapToScreenShareProps, ScreenShareContainerProps } from './consumers/MapToScreenShareProps';
import { StreamMedia, VideoTile } from '../../components';

const ScreenShareComponent = (props: ScreenShareContainerProps): JSX.Element => {
  const { displayName, videoRender, isVideoRenderAvailable, screenShareRender, isScreenShareRenderAvailable } = props;

  return (
    <>
      <VideoTile
        isVideoReady={isScreenShareRenderAvailable}
        videoProvider={<StreamMedia videoStreamElement={screenShareRender} />}
        placeholderProvider={
          <div className={loadingStyle}>
            <Spinner label={`Loading ${displayName}'s screen`} size={SpinnerSize.xSmall} />
          </div>
        }
        styles={{
          overlayContainer: videoStreamStyle
        }}
      >
        {isVideoRenderAvailable && isScreenShareRenderAvailable && (
          <VideoTile
            isVideoReady={isVideoRenderAvailable}
            videoProvider={<StreamMedia videoStreamElement={videoRender} />}
          />
        )}
      </VideoTile>
    </>
  );
};

export default connectFuncsToContext(ScreenShareComponent, MapToScreenShareProps);
