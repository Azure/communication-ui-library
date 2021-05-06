// © Microsoft Corporation. All rights reserved.

import { MessageStatus, ReadReceipt as ReadRecieptComponent } from '@azure/communication-react';
import { select, text } from '@storybook/addon-knobs';
import { Meta } from '@storybook/react/types-6-0';
import React from 'react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { getDocs } from './ReadReceiptDocs';

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Read Receipt`,
  component: ReadRecieptComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const ReadReceipt = (): JSX.Element => {
  return (
    <ReadRecieptComponent
      messageStatus={select<MessageStatus>('Message Status', ['delivered', 'sending', 'seen', 'failed'], 'delivered')}
      deliveredTooltipText={text('Delivered icon tooltip text', 'Sent')}
      sendingTooltipText={text('Sending icon tooltip text', 'Sending')}
      seenTooltipText={text('Seen icon tooltip text', 'Seen')}
      failedToSendTooltipText={text('Failed to send icon tooltip text', 'Failed to send')}
    />
  );
};
