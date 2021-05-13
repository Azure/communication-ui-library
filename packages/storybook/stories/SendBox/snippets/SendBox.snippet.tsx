import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const SendBoxExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onTyping={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
