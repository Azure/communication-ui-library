import React from 'react';
import { SendBox, FluentThemeProvider } from '@azure/communication-ui';

export const SendBoxWithSystemMessageExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onMessageSend={async () => {
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
