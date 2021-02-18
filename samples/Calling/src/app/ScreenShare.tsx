// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { Spinner, SpinnerSize } from '@fluentui/react';
import { loadingStyle, videoStreamStyle } from './styles/ScreenShare.styles';

import { connectFuncsToContext } from '@azure/communication-ui';
import { MapToScreenShareProps, ScreenShareContainerProps } from './consumers/MapToScreenShareProps';
import { MediaGalleryTileComponent } from '@azure/communication-ui';

const ScreenShareComponent = (props: ScreenShareContainerProps): JSX.Element => {
  const { displayName, videoRender, isVideoRenderAvailable, screenShareRender, isScreenShareRenderAvailable } = props;

  return (
    <>
      <MediaGalleryTileComponent
        isVideoReady={isScreenShareRenderAvailable}
        videoStreamElement={screenShareRender}
        fallbackElement={
          <div className={loadingStyle}>
            <Spinner label={`Loading ${displayName}'s screen`} size={SpinnerSize.xSmall} />
          </div>
        }
      />
      {isVideoRenderAvailable && isScreenShareRenderAvailable && (
        <div className={videoStreamStyle}>
          <MediaGalleryTileComponent isVideoReady={isVideoRenderAvailable} videoStreamElement={videoRender} />
        </div>
      )}
    </>
  );
};

export default connectFuncsToContext(ScreenShareComponent, MapToScreenShareProps);
