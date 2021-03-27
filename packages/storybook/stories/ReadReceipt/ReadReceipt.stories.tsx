// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { MessageStatus, ReadReceiptComponent } from '@azure/communication-ui';
import { select, text } from '@storybook/addon-knobs';
import { getDocs } from './ReadReceiptDocs';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { Meta } from '@storybook/react/types-6-0';

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/ReadReceipt`,
  component: ReadReceiptComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

export const ReadRecieptIconComponent = (): JSX.Element => {
  return (
    <ReadReceiptComponent
      messageStatus={select<MessageStatus>('Message Status', MessageStatus, MessageStatus.DELIVERED)}
      deliveredTooltipText={text('Delivered icon tooltip text', 'Sent')}
      sendingTooltipText={text('Sending icon tooltip text', 'Sending')}
      seenTooltipText={text('Seen icon tooltip text', 'Seen')}
      failedToSendTooltipText={text('Failed to send icon tooltip text', 'Failed to send')}
    />
  );
};
