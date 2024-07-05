// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageStatusIndicator as MessageStatusIndicatorComponent } from '@azure/communication-react';
import { Meta } from '@storybook/react';
import { controlsToAdd, hiddenControl } from '../../controlsUtils';
import { MessageStatusIndicatorExample } from './snippets/MessageStatusIndicator.snippet';
export { MessageStatusIndicator } from './MessageStatusIndicator.story';

export const MessageStatusIndicatorSnippetDocsOnly = {
  render: MessageStatusIndicatorExample
};

const meta: Meta = {
  component: MessageStatusIndicatorComponent,
  title: 'Components/Message Status Indicator',
  argTypes: {
    status: controlsToAdd.messageStatus,
    deliveredTooltipText: controlsToAdd.messageDeliveredTooltipText,
    sendingTooltipText: controlsToAdd.messageSendingTooltipText,
    seenTooltipText: controlsToAdd.messageSeenTooltipText,
    readByTooltipText: controlsToAdd.messageReadByTooltipText,
    failedToSendTooltipText: controlsToAdd.messageFailedToSendTooltipText,
    // Hide default controls
    readCount: hiddenControl,
    onToggleToolTip: hiddenControl,
    remoteParticipantsCount: hiddenControl,
    styles: hiddenControl,
    strings: hiddenControl
  },
  args: {
    status: 'delivered',
    deliveredTooltipText: 'Delivered',
    sendingTooltipText: 'Sending',
    seenTooltipText: 'Seen',
    readByTooltipText: 'Read by',
    failedToSendTooltipText: 'Failed to send'
  }
};

export default meta;
