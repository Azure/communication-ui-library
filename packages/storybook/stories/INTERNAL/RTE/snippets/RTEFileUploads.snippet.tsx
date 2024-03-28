import { FluentThemeProvider, RichTextSendBox } from '@azure/communication-react';
import React from 'react';

export const RTEAttachmentUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <RichTextSendBox
        activeAttachmentUploads={[
          {
            id: '1',
            filename: 'Sample.pdf',
            progress: 0.75,
            uploadComplete: false
          },
          {
            id: '2',
            filename: 'SampleXl.xlsx',
            progress: 0.33,
            uploadComplete: false
          }
        ]}
        onSendMessage={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
