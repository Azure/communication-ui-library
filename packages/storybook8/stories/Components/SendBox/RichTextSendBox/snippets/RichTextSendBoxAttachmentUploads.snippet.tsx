import { FluentThemeProvider, RichTextSendBox } from '@azure/communication-react';
import React from 'react';

export const RichTextSendBoxAttachmentUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <RichTextSendBox
        attachments={[
          {
            id: '3b0785642e8b',
            name: 'Sample.pdf',
            progress: 0.75
          },
          {
            id: '199f184a1d40',
            name: 'SampleXl.xlsx',
            progress: 0.33
          }
        ]}
        onSendMessage={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
