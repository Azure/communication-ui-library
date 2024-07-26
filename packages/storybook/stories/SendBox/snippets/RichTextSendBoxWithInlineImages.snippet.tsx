import { RichTextSendBox, FluentThemeProvider, AttachmentMetadataInProgress } from '@azure/communication-react';
import React, { useState } from 'react';

export const RichTextSendBoxWithInlineImagesExample: () => JSX.Element = () => {
  const [inlineImages, setInlineImages] = useState<AttachmentMetadataInProgress[] | undefined>();

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <RichTextSendBox
          onSendMessage={async () => {
            return;
          }}
          onInsertInlineImage={(image: string) => {
            const id = inlineImages?.length ? (inlineImages.length + 1).toString() : '1';
            const newImage = {
              id,
              name: 'image',
              progress: 1,
              url: image,
              error: undefined
            };
            setInlineImages([...(inlineImages ?? []), newImage]);
          }}
          inlineImages={inlineImages}
          onCancelInlineImageUpload={() => alert('requested to cancel inline image upload')}
        />
      </div>
    </FluentThemeProvider>
  );
};
