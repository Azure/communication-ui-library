import { MessageStatus, MessageStatusIndicator } from '@azure/communication-react';
import React from 'react';

export const MessageStatusIndicatorExample: () => JSX.Element = () => {
  return (
    <>
      <MessageStatusIndicator messageStatus={'delivered' as MessageStatus} />
      <MessageStatusIndicator messageStatus={'seen' as MessageStatus} />
      <MessageStatusIndicator messageStatus={'sending' as MessageStatus} />
      <MessageStatusIndicator messageStatus={'failed' as MessageStatus} />
    </>
  );
};
