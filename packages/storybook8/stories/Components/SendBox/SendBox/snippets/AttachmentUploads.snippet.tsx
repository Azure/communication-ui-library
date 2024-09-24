import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import { initializeIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React from 'react';

// initializeIcons() and initializeFileTypeIcons() should only be called once in the application
initializeIcons();
initializeFileTypeIcons();

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
