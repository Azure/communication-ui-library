import { FluentThemeProvider, StreamMedia, VideoTile } from '@azure/communication-ui';
import React from 'react';
import { renderVideoStream } from '../../../utils';
import { Banner, TeamsInterop } from './Banner.snippet';
import { CallControlBar } from './CallControlBar.snippet';

export interface CallProps {
  teamsInteropCurrent: TeamsInterop;
  teamsInteropPrevious: TeamsInterop;
}

export const CallComponent = (props: CallProps): JSX.Element => {
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
        {needsComplianceBanner(props) ? (
          <Banner teamsInteropCurrent={props.teamsInteropCurrent} teamsInteropPrevious={props.teamsInteropPrevious} />
        ) : (
          <></>
        )}
        <CallControlBar />
      </VideoTile>
    </FluentThemeProvider>
  );
};

function needsComplianceBanner(props: CallProps): boolean {
  return [
    props.teamsInteropCurrent.recordingEnabled,
    props.teamsInteropCurrent.transcriptionEnabled,
    props.teamsInteropPrevious.recordingEnabled,
    props.teamsInteropPrevious.transcriptionEnabled
  ].some((x) => x);
}
