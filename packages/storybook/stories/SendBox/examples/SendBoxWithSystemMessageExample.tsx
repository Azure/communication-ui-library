import React from 'react';
import { SendBox } from '@azure/communication-ui';

export const SendBoxWithSystemMessageExample: () => JSX.Element = () => (
  <div style={{ width: '400px', margin: '0 5px' }}>
    <SendBox
      onSendMessage={async () => {
        return;
      }}
      onSendTypingNotification={(): Promise<void> => {
        return Promise.resolve();
      }}
      systemMessage="Please wait 30 seconds to send new messages"
    />
  </div>
);
