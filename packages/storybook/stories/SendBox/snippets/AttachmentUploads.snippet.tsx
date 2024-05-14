import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const AttachmentUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        attachments={[
          {
            id: '1',
            name: 'Sample.pdf',
            progress: 0.75
          },
          {
            id: '2',
            name: 'SampleXl.xlsx',
            progress: 0.33
          }
        ]}
      />
    </div>
  </FluentThemeProvider>
);
