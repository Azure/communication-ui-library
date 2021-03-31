import React from 'react';
import { SendBox } from '@azure/communication-ui';

export const SendBoxExample: () => JSX.Element = () => (
  <div style={{ width: '400px', margin: '0 5px' }}>
    <SendBox
      onSendMessage={async () => {
        return;
      }}
      onSendTypingNotification={(): Promise<void> => {
        return Promise.resolve();
      }}
    />
  </div>
);
