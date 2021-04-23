import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-ui';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { Banner, BannerProps } from './Banner.snippet';
import { CallControlBar } from './CallControlBar.snippet';
import { TeamsState } from './TeamsState.snippet';

export interface CallProps {
  teamsState: TeamsState;
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
          {needsComplianceBanner(this.props.teamsState) ? <Banner teamsState={this.props.teamsState} /> : <></>}
          <CallControlBar />
        </VideoTile>
      </FluentThemeProvider>
    );
  }
}

function needsComplianceBanner(s: TeamsState): boolean {
  return (
    s.recordingEnabled || s.recordingPreviouslyEnabled || s.transcriptionEnabled || s.transcriptionPreviouslyEnabled
  );
}
