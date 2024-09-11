import { SendBox, FluentThemeProvider, DEFAULT_COMPONENT_ICONS } from '@azure/communication-react';
import { initializeIcons, registerIcons } from '@fluentui/react';
import React from 'react';

initializeIcons();
registerIcons({ icons: DEFAULT_COMPONENT_ICONS });

export const SendBoxExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onTyping={async () => {
          return;
        }}
      />
    </div>
  </FluentThemeProvider>
);
