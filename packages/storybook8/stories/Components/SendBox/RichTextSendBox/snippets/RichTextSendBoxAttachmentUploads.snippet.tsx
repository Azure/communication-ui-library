import { FluentThemeProvider, RichTextSendBox, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React from 'react';

initializeIcons();
initializeFileTypeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

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
