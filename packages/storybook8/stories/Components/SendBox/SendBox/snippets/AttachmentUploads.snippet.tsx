import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const AttachmentUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        attachments={[
          {
            id: '7e61ebe5ae4a',
            name: 'Sample.pdf',
            progress: 0.75
          },
          {
            id: 'a81018dc2064',
            name: 'SampleXl.xlsx',
            progress: 0.33
          }
        ]}
      />
    </div>
  </FluentThemeProvider>
);
