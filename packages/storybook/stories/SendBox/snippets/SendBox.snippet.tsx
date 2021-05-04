import React from 'react';
import { SendBox, FluentThemeProvider } from 'react-components';

export const SendBoxExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onMessageSend={async () => {
          return;
        }}
        onTyping={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
