import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const SendBoxWithSystemMessageExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onTyping={async () => {
          return;
        }}
        systemMessage="Please wait 30 seconds to send new messages"
      />
    </div>
  </FluentThemeProvider>
);
