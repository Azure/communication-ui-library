import {
  audioButtonProps,
  ControlBar,
  FluentThemeProvider,
  hangupButtonProps,
  StreamMedia,
  videoButtonProps,
  VideoTile
} from '@azure/communication-ui';
import { DefaultButton } from '@fluentui/react';
import React from 'react';
import { renderVideoStream } from '../utils';

export const VideoTileExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <VideoTile
        isVideoReady={true}
        videoProvider={<StreamMedia videoStreamElement={renderVideoStream()} />}
        avatarName={'Jack Reacher'}
        invertVideo={true}
        styles={{
          root: { height: '300px', width: '400px' },
          overlayContainer: { background: 'rgba(165, 13, 13, 0.5)' }
        }}
      >
        <ControlBar layout="floatingBottom">
          <DefaultButton {...videoButtonProps} />
          <DefaultButton {...audioButtonProps} />
          <DefaultButton {...hangupButtonProps} />
        </ControlBar>
      </VideoTile>
    </FluentThemeProvider>
  );
};
