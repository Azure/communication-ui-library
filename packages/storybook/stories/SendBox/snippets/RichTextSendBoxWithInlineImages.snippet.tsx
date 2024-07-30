import { RichTextSendBox, FluentThemeProvider, AttachmentMetadataInProgress } from '@azure/communication-react';
import React, { useState } from 'react';

export const RichTextSendBoxWithInlineImagesExample: () => JSX.Element = () => {
  const [inlineImages, setInlineImages] = useState<AttachmentMetadataInProgress[] | undefined>();

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <RichTextSendBox
          onSendMessage={async () => {
            setInlineImages(undefined);
            return;
          }}
          onInsertInlineImage={(image: string, imageFileName?: string) => {
            const id = inlineImages?.length ? (inlineImages.length + 1).toString() : '1';
            const newImage = {
              id,
              name: imageFileName ?? 'image.png',
              progress: 1,
              url: image,
              error: undefined
            };
            setInlineImages([...(inlineImages ?? []), newImage]);
          }}
          inlineImages={inlineImages}
          onCancelInlineImageUpload={(imageAttributes: Record<string, string>) => {
            const filteredInlineImages = inlineImages?.filter((image) => image.id !== imageAttributes.id);
            setInlineImages(filteredInlineImages);
          }}
        />
      </div>
    </FluentThemeProvider>
  );
};
