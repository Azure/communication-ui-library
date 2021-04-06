import React from 'react';
import { SendBox, FluentThemeProvider } from '@azure/communication-ui';
import { Icon } from '@fluentui/react';

export const CustomIconExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '400px' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onSendTypingNotification={async () => {
          return;
        }}
        onRenderIcon={() => <Icon iconName="AirplaneSolid" />}
      />
    </div>
  </FluentThemeProvider>
);
