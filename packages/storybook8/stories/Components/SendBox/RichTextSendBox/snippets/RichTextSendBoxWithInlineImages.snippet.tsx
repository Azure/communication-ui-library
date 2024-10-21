import { RichTextSendBox, FluentThemeProvider, AttachmentMetadataInProgress } from '@azure/communication-react';
import React, { useState } from 'react';
import { _DEFAULT_INLINE_IMAGE_FILE_NAME } from '../../../../../../react-composites/src/composites/common/constants';

export const RichTextSendBoxWithInlineImagesExample: () => JSX.Element = () => {
  const [inlineImagesWithProgress, setInlineImagesWithProgress] = useState<
    AttachmentMetadataInProgress[] | undefined
  >();

  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <RichTextSendBox
          onSendMessage={async () => {
            setInlineImagesWithProgress(undefined);
            return;
          }}
          onInsertInlineImage={(imageAttributes: Record<string, string>) => {
            const id = imageAttributes.id;
            if (!id) {
              throw new Error('Image id is missing');
            }
            const newImage = {
              id,
              name: imageAttributes['data-image-file-name'] ?? _DEFAULT_INLINE_IMAGE_FILE_NAME,
              progress: 1,
              url: imageAttributes.src,
              error: undefined
            };
            setInlineImagesWithProgress([...(inlineImagesWithProgress ?? []), newImage]);
          }}
          inlineImagesWithProgress={inlineImagesWithProgress}
          onRemoveInlineImage={(imageAttributes: Record<string, string>) => {
            const filteredInlineImages = inlineImagesWithProgress?.filter((image) => image.id !== imageAttributes.id);
            setInlineImagesWithProgress(filteredInlineImages);
          }}
        />
      </div>
    </FluentThemeProvider>
  );
};
