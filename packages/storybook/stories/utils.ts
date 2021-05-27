// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useEffect, useRef, useState } from 'react';

const renderVideoStream = async (scalingMode?: string): Promise<HTMLElement | null> => {
  if (navigator.mediaDevices?.getUserMedia) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.style.height = '100%';
    video.style.width = '100%';
    video.style.objectFit = scalingMode ?? 'cover';

    try {
      video.srcObject = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (e) {
      console.log('Unable to get stream for video', e);
    }

    return video;
  }

  return null;
};

const stopRenderVideoStream = (video: HTMLElement | null): void => {
  if (!video) {
    return;
  }

  const mediaProvider = (video as HTMLVideoElement).srcObject;
  if (!mediaProvider) {
    return;
  }

  const stream = mediaProvider as MediaStream;
  if (!stream.getVideoTracks) {
    return;
  }

  for (const track of stream.getVideoTracks()) {
    track.stop();
  }
};

export const useVideoStream = (enabled: boolean): HTMLElement | null => {
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  });

  const [videoStreamElement, setVideoStreamElement] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const loadVideo = async (): Promise<void> => {
      const videoStreamElement = await renderVideoStream();
      setVideoStreamElement(videoStreamElement);
      // Since the render is async, it may finish after the component is unmounted already, in this case we have to make
      // sure to clean up the stream
      if (!mounted.current) {
        stopRenderVideoStream(videoStreamElement);
      }
    };
    if (enabled) {
      loadVideo();
    }
  }, [enabled]);

  // Clean up videoStream if the component unmounts
  useEffect(() => {
    return () => {
      stopRenderVideoStream(videoStreamElement);
    };
  }, [videoStreamElement]);

  return videoStreamElement;
};
