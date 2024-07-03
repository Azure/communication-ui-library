// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { FluentThemeProvider, ImageOverlay as ImageOverlayComponent } from '@azure/communication-react';
import React, { useState } from 'react';

const ImageOverlayStory = (args: { showTitle: string | undefined; setAltText: string | undefined }): JSX.Element => {
  const [overlayImageSrc, setOverlayImageSrc] = useState<string>();
  const imgClickedHandler = (event: React.MouseEvent<HTMLImageElement>): void => {
    event.stopPropagation();

    const img = event.currentTarget;
    setOverlayImageSrc(img.src);
  };

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <img alt="image" src="images/inlineImageExample1.png" onClick={imgClickedHandler} />
      </div>
      <ImageOverlayComponent
        isOpen={overlayImageSrc !== undefined}
        imageSrc={overlayImageSrc || ''}
        title={args.showTitle}
        altText={args.setAltText}
        onDismiss={() => {
          setOverlayImageSrc(undefined);
        }}
        onDownloadButtonClicked={() => {
          alert('Download button clicked');
        }}
      />
    </FluentThemeProvider>
  );
};

export const ImageOverlay = ImageOverlayStory.bind({});
