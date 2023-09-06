import { ImageGallery, ImageGalleryImageProps, FluentThemeProvider } from '@azure/communication-react';
import React, { useState } from 'react';

export const ImageGalleryExample: () => JSX.Element = () => {
  const [galleryImages, setGalleryImages] = useState<Array<ImageGalleryImageProps>>([]);
  const imgClickedHandler = (event: React.MouseEvent<HTMLImageElement>): void => {
    event.stopPropagation();

    const img = event.currentTarget;
    const source = img.src;
    const title = 'Image';
    const galleryImage: ImageGalleryImageProps = {
      title: title,
      saveAsName: source,
      imageUrl: source
    };
    setGalleryImages([galleryImage]);
  };

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <img alt="image" src="images/inlineImageExample1.png" onClick={imgClickedHandler} />
      </div>
      <ImageGallery
        isOpen={galleryImages.length > 0}
        images={galleryImages}
        onDismiss={() => {
          setGalleryImages([]);
        }}
        onImageDownloadButtonClicked={() => {
          alert('Download button clicked');
        }}
      />
    </FluentThemeProvider>
  );
};
