// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { loadingStyle, videoStreamStyle } from './styles/ScreenShare.styles';

import { connectFuncsToContext } from '../../consumers';
import { MapToScreenShareProps, ScreenShareContainerProps } from './consumers/MapToScreenShareProps';
import { StreamMediaComponent, VideoTileComponent } from '../../components';

const ScreenShareComponent = (props: ScreenShareContainerProps): JSX.Element => {
  const { displayName, videoRender, isVideoRenderAvailable, screenShareRender, isScreenShareRenderAvailable } = props;

  return (
    <>
      <VideoTileComponent
        isVideoReady={isScreenShareRenderAvailable}
        videoProvider={<StreamMediaComponent videoStreamElement={screenShareRender} />}
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
          <VideoTileComponent
            isVideoReady={isVideoRenderAvailable}
            videoProvider={<StreamMediaComponent videoStreamElement={videoRender} />}
          />
        )}
      </VideoTileComponent>
    </>
  );
};

export default connectFuncsToContext(ScreenShareComponent, MapToScreenShareProps);
