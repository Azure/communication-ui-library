import { VideoGallery, usePropsFor } from '@azure/communication-react';
import React from 'react';

export const CallScreen = (): JSX.Element => {
  // Use usePropsFor to get properties for VideoGallery
  const videoGalleryProps = usePropsFor(VideoGallery);

  // Display TogetherMode in VideoGallery, using the properties
  return <VideoGallery {...videoGalleryProps} />;
};
