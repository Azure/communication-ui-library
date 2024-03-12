import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const FileUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        activeFileUploads={[
          {
            id: '1',
            name: 'Sample.pdf',
            extension: 'pdf',
            progress: 0.75
          },
          {
            id: '1',
            name: 'SampleXl.xlsx',
            extension: 'xlsx',
            progress: 0.33
          }
        ]}
      />
    </div>
  </FluentThemeProvider>
);
