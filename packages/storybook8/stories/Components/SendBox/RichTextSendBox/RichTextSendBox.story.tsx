// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AttachmentMetadataInProgress, RichTextSendBox as RichTextSendBoxComponent } from '@azure/communication-react';
import React, { useState } from 'react';
import {
  _DEFAULT_INLINE_IMAGE_FILE_NAME,
  _IMAGE_ATTRIBUTE_INLINE_IMAGE_FILE_NAME_KEY
} from '../../../../../react-composites/src/composites/common/constants';

const RichTextSendBoxStory = (args: {
  disabled: boolean | undefined;
  hasAttachments: any;
  hasWarning: any;
  warningMessage: string | undefined;
}): JSX.Element => {
  const timeoutRef = React.useRef<NodeJS.Timeout>();
  const delayForSendButton = 300;
  const [inlineImagesWithProgress, setInlineImagesWithProgress] = useState<
    AttachmentMetadataInProgress[] | undefined
  >();

  return (
    <div style={{ width: '31.25rem', maxWidth: '90%' }}>
      <RichTextSendBoxComponent
        disabled={args.disabled}
        attachments={
          args.hasAttachments
            ? [
                {
                  id: 'f2d1fce73c98',
                  name: 'file1.txt',
                  url: 'https://www.contoso.com/file1.txt',
                  progress: 1
                },
                {
                  id: 'dc3a33ebd321',
                  name: 'file2.docx',
                  url: 'https://www.contoso.com/file2.txt',
                  progress: 1
                }
              ]
            : undefined
        }
        systemMessage={args.hasWarning ? args.warningMessage : undefined}
        onSendMessage={async (message, options) => {
          timeoutRef.current = setTimeout(() => {
            setInlineImagesWithProgress(undefined);
            alert(`sent message: ${message} with options ${JSON.stringify(options)}`);
          }, delayForSendButton);
        }}
        onCancelAttachmentUpload={(attachmentId) => {
          window.alert(`requested to cancel attachment upload for attachment with id: "${attachmentId}"`);
        }}
        onTyping={(): Promise<void> => {
          console.log(`sending typing notifications`);
          return Promise.resolve();
        }}
        onInsertInlineImage={(imageAttributes: Record<string, string>) => {
          const newImage = {
            id: imageAttributes.id,
            name: imageAttributes[_IMAGE_ATTRIBUTE_INLINE_IMAGE_FILE_NAME_KEY] ?? _DEFAULT_INLINE_IMAGE_FILE_NAME,
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
  );
};

export const RichTextSendBox = RichTextSendBoxStory.bind({});
