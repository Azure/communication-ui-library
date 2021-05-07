// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export const renderVideoStream = (scalingMode?: string): HTMLElement | null => {
  if (navigator.mediaDevices?.getUserMedia) {
    const video = document.createElement('video');
    video.autoplay = true;
    video.style.height = '100%';
    video.style.width = '100%';
    video.style.objectFit = scalingMode ?? 'cover';

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      })
      .catch(function (error) {
        console.log('Something went wrong!', error);
      });

    return video;
  }

  return null;
};
