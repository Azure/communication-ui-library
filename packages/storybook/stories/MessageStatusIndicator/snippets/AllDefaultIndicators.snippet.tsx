import { MessageStatus, MessageStatusIndicator } from '@azure/communication-react';
import React from 'react';

export const DefaultMessageStatusIndicatorsExample: () => JSX.Element = () => {
  return (
    <>
      <MessageStatusIndicator status={'delivered' as MessageStatus} />
      <MessageStatusIndicator status={'seen' as MessageStatus} />
      <MessageStatusIndicator status={'sending' as MessageStatus} />
      <MessageStatusIndicator status={'failed' as MessageStatus} />
    </>
  );
};
