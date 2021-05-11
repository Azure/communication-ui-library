import { MessageStatus, ReadReceipt } from '@azure/communication-react';
import React from 'react';

export const ReadReceiptExample: () => JSX.Element = () => {
  return (
    <>
      <ReadReceipt messageStatus={'delivered' as MessageStatus} />
      <ReadReceipt messageStatus={'seen' as MessageStatus} />
      <ReadReceipt messageStatus={'sending' as MessageStatus} />
      <ReadReceipt messageStatus={'failed' as MessageStatus} />
    </>
  );
};
