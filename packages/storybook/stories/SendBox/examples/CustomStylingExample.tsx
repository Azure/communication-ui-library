import React from 'react';
import { SendBox, FluentThemeProvider } from '@azure/communication-ui';

export const CustomStylingExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onSendTypingNotification={async () => {
          return;
        }}
        styles={{
          root: { border: '2px solid gray', borderRadius: '10px', padding: '10px' },
          systemMessage: { border: '1px solid darkred', background: 'lightpink' },
          textField: { background: 'ghostwhite' }
          // The sub-components below are also available
          // sendMessageIconContainer: { },
          // sendMessageIcon: { }
        }}
        systemMessage="This is a system message"
      />
    </div>
  </FluentThemeProvider>
);
