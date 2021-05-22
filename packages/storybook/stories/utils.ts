// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { useEffect, useRef, useState } from 'react';

const renderVideoStream = async (scalingMode?: string): Promise<HTMLVideoElement | null> => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return null;
  }

  const video = document.createElement('video');
  video.autoplay = true;
  video.style.height = '100%';
  video.style.width = '100%';
  video.style.objectFit = scalingMode ?? 'cover';

  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  video.srcObject = stream;
  return video;
};

const stopVideoStream = (videoElement: HTMLVideoElement): void => {
  const stream: MediaProvider | null = videoElement.srcObject;

  if (!stream) {
    return;
  }

  const mediaStream = stream as MediaStream;
  mediaStream.getVideoTracks().forEach(function (track) {
    if (track.readyState === 'live' && track.kind === 'video') {
      track.stop();
    }
  });

  return;
};

// utility hook to use a video element generated from your camera
export const useCamera = (useCamera: boolean, scalingMode?: string): HTMLVideoElement | null => {
  // we need to hold onto the exact same reference of the HTML video element
  const streamElementRef = useRef<HTMLVideoElement | null>(null);
  // we need to use a state variable so we can create changes that will force a re-render
  const [streamElement, setStreamElement] = useState<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (useCamera) {
      renderVideoStream(scalingMode).then((elem) => {
        streamElementRef.current = elem;
        setStreamElement(elem);
      });
    } else if (streamElementRef.current) {
      stopVideoStream(streamElementRef.current);
      setStreamElement(null);
    }

    return () => {
      if (streamElementRef.current) {
        stopVideoStream(streamElementRef.current);
      }
      setStreamElement(null);
      streamElementRef.current = null;
    };
  }, [useCamera]);
  return streamElement;
};
