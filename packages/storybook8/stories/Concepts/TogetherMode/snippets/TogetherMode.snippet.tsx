import { VideoGallery, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const CallScreen = (): JSX.Element => {
  // Use usePropsFor to get properties for VideoGallery
  const videoGalleryProps = usePropsFor(VideoGallery);

  // Logging remote participants' PPTLive stream without modifying the array
  if (videoGalleryProps.isTogetherModeActive) {
    console.log('Together Mode is active');
  }

  // Display TogetherMode in VideoGallery, using the properties
  return <VideoGallery {...videoGalleryProps} />;
};
