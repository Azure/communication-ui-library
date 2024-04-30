import { VideoTile } from '@azure/communication-react';
import React from 'react';
import { ComplianceBanner } from './ComplianceBanner.snippet';

export const CallComponent = (): JSX.Element => {
  const videoTileStyles = {
    root: { height: '100%', width: '100%' },
    overlayContainer: {}
  };

  return (
    <VideoTile styles={videoTileStyles}>
      <ComplianceBanner callRecordState={true} callTranscribeState={true} />
    </VideoTile>
  );
};
