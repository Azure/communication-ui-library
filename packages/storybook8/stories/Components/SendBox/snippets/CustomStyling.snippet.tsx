import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import React from 'react';

export const CustomStylingExample: () => JSX.Element = () => {
  const sendBoxStyles = {
    root: { border: '2px solid gray', borderRadius: '10px', padding: '10px' },
    systemMessage: { border: '1px solid darkred', background: 'lightpink' },
    sendMessageIconContainer: { marginBottom: '1.35rem' },
    textField: { background: 'ghostwhite' }
    // The sub-components below are also available
    // sendMessageIcon: { }
  };
  return (
    <FluentThemeProvider>
      <div style={{ width: '31.25rem' }}>
        <SendBox
          onSendMessage={async () => {
            return;
          }}
          onTyping={async () => {
            return;
          }}
          styles={sendBoxStyles}
          systemMessage="This is a system message"
        />
      </div>
    </FluentThemeProvider>
  );
};
