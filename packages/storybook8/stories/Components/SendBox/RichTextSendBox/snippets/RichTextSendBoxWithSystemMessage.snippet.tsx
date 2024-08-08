import { RichTextSendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const RichTextSendBoxWithSystemMessageExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <RichTextSendBox
        onSendMessage={async () => {
          return;
        }}
        systemMessage="Please wait 30 seconds to send new messages"
      />
    </div>
  </FluentThemeProvider>
);
