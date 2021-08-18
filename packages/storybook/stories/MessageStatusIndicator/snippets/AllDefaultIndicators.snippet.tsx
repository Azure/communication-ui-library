import { MessageStatus, MessageStatusIndicator } from '@azure/communication-react';
import { Stack } from '@fluentui/react';
import React from 'react';

export const DefaultMessageStatusIndicatorsExample: () => JSX.Element = () => {
  return (
    <Stack>
      <MessageStatusIndicator status={'delivered' as MessageStatus} />
      <MessageStatusIndicator status={'seen' as MessageStatus} />
      <MessageStatusIndicator status={'sending' as MessageStatus} />
      <MessageStatusIndicator status={'failed' as MessageStatus} />
    </Stack>
  );
};
