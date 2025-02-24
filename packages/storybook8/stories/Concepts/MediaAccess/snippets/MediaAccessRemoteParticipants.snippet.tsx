import { VideoGallery, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const CallScreen = (): JSX.Element => {
  // Use usePropsFor to get properties for VideoGallery
  const videoGalleryProps = usePropsFor(VideoGallery);

  // Logging remote participants' media access state without modifying the array
  videoGalleryProps.remoteParticipants.forEach((participant) => {
    console.log(
      `Participant [${participant.userId}:${participant.displayName}]'s media access:`,
      participant.mediaAccess
    );
  });

  // Display VideoGallery
  return <VideoGallery {...videoGalleryProps} />;
};
