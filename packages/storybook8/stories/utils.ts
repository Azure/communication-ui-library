// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { useEffect, useRef, useState } from 'react';

export const renderVideoStream = async (scalingMode?: string): Promise<HTMLElement | null> => {
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

/**
 * Manages multiple videoStreams. The amount is based on the given numberOfStreams parameter. When component is
 * unmounted will automatically dispose of all the managed video streams.
 *
 * @param numberOfStreams - Number of video streams to create
 * @returns
 */
export const useVideoStreams = (numberOfStreams: number): (HTMLElement | null)[] => {
  const mounted = useRef(true);
  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  const [videoStreamElements, setVideoStreamElements] = useState<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const newVideoStreamElements: (HTMLElement | null)[] = [];
    const loadVideos = async (): Promise<void> => {
      for (let i = 0; i < numberOfStreams; i++) {
        const videoStreamElement = await renderVideoStream();
        newVideoStreamElements.push(videoStreamElement);
      }
      // Since the render is async, it may finish after the component is unmounted already, in this case we have to make
      // sure to clean up the stream
      if (!mounted.current) {
        for (const videoStreamElement of newVideoStreamElements) {
          stopRenderVideoStream(videoStreamElement);
        }
      } else {
        setVideoStreamElements(newVideoStreamElements);
      }
    };
    loadVideos();
  }, [numberOfStreams]);

  // Clean up videoStream if the component unmounts
  useEffect(() => {
    return () => {
      for (const videoStreamElement of videoStreamElements) {
        stopRenderVideoStream(videoStreamElement);
      }
    };
  }, [videoStreamElements]);

  return videoStreamElements;
};
export const addCSS = (css: string): string =>
  (document.head.appendChild(document.createElement('style')).innerHTML = css);
