// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import {
  MessageStatus,
  MessageStatusIndicator as MessageStatusIndicatorComponent,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';

import React from 'react';

initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

const MessageStatusIndicatorStory = (args: {
  status: string;
  deliveredTooltipText: string;
  sendingTooltipText: string;
  seenTooltipText: string;
  readByTooltipText: string;
  failedToSendTooltipText: string;
}): JSX.Element => {
  return (
    <MessageStatusIndicatorComponent
      status={args.status as MessageStatus}
      strings={{
        deliveredTooltipText: args.deliveredTooltipText,
        sendingTooltipText: args.sendingTooltipText,
        seenTooltipText: args.seenTooltipText,
        readByTooltipText: args.readByTooltipText,
        failedToSendTooltipText: args.failedToSendTooltipText
      }}
    />
  );
};

export const MessageStatusIndicator = MessageStatusIndicatorStory.bind({});
