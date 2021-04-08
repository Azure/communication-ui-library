import React from 'react';
import { SendBox, FluentThemeProvider } from '@azure/communication-ui';

export const SendBoxExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
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
