import { FluentThemeProvider } from '@azure/communication-react';
import React from 'react';
import { ChatMessageComponentAsRichTextEditBox } from '@internal/react-components';

export const RichTextEditBoxAttachmentUploadsExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <ChatMessageComponentAsRichTextEditBox
        activeAttachmentUploads={[
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
        onSendMessage={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
