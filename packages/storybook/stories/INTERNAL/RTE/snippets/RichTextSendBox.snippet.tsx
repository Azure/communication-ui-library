import { RichTextSendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const RichTextSendBoxExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
