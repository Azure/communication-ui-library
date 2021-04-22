import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-ui';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { Banner, BannerProps } from './Banner.snippet';
import { CallControlBar } from './CallControlBar.snippet';

export interface CallProps {
  banner: BannerProps;
}

export class CallComponent extends React.Component<CallProps> {
  render(): JSX.Element {
    const videoTileStyles = {
      root: { height: '100%', width: '100%' },
      overlayContainer: {}
    };

    return (
      <FluentThemeProvider>
        <VideoTile
          styles={videoTileStyles}
          invertVideo={true}
          isVideoReady={true}
          videoProvider={
            // Replace with your own video provider.
            <StreamMedia videoStreamElement={renderVideoStream()} />
          }
          placeholderProvider={<></>}
        >
          <Banner {...this.props.banner} />
          <CallControlBar />
        </VideoTile>
      </FluentThemeProvider>
    );
  }
}
