import { FluentThemeProvider, ImageOverlay } from '@azure/communication-react';
import React, { useState } from 'react';

export const ImageOverlayExample: () => JSX.Element = () => {
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
      <ImageOverlay
        isOpen={overlayImageSrc !== undefined}
        imageSrc={overlayImageSrc || ''}
        title="Image"
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
