import { VideoGallery, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const CallScreen = (): JSX.Element => {
  // Use usePropsFor to get properties for VideoGallery
  const videoGalleryProps = usePropsFor(VideoGallery);

  // Logging remote participants' PPTLive stream without modifying the array
  videoGalleryProps.remoteParticipants.forEach((participant) => {
    console.log('PPTLive Stream:', participant.screenShareStream);
  });

  // Display PPTLive in VideoGallery, using the properties and modified participants
  return <VideoGallery {...videoGalleryProps} />;
};
