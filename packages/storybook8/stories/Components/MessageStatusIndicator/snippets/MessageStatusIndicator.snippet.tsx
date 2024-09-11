import {
  MessageStatus,
  MessageStatusIndicator as MessageStatusIndicatorComponent,
  DEFAULT_COMPONENT_ICONS
} from '@azure/communication-react';
import { initializeIcons, registerIcons, Stack } from '@fluentui/react';
import React from 'react';

// initializeIcons() and registerIcons() should only be called once in the application
initializeIcons();
registerIcons({ icons: { ...DEFAULT_COMPONENT_ICONS } });

export const MessageStatusIndicatorExample: () => JSX.Element = () => {
  return (
    <Stack horizontalAlign="start">
      <MessageStatusIndicatorComponent status={'delivered' as MessageStatus} />
      <MessageStatusIndicatorComponent status={'seen' as MessageStatus} />
      <MessageStatusIndicatorComponent status={'sending' as MessageStatus} />
      <MessageStatusIndicatorComponent status={'failed' as MessageStatus} />
    </Stack>
  );
};
