import React from 'react';
import { SendBox, FluentThemeProvider } from '@azure/communication-ui';

export const SendBoxExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '400px' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onSendTypingNotification={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
