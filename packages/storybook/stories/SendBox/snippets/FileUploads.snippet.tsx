import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const FileUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        activeFileUploads={[
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
      />
    </div>
  </FluentThemeProvider>
);
