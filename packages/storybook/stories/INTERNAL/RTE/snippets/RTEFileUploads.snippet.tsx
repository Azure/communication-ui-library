import { FluentThemeProvider, RichTextSendBox } from '@azure/communication-react';
import React from 'react';

export const RTEFileUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <RichTextSendBox
        activeFileUploads={[
          {
            id: '1',
            filename: 'Sample.pdf',
            progress: 0.75,
            uploadComplete: false
          },
          {
            id: '1',
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
