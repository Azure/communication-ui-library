import { SendBox, FluentThemeProvider } from '@azure/communication-react';
import { Icon } from '@fluentui/react';
import React from 'react';

export const CustomIconExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onSendMessage={async () => {
          return;
        }}
        onTyping={async () => {
          return;
        }}
        onRenderIcon={() => <Icon iconName="AirplaneSolid" />}
      />
    </div>
  </FluentThemeProvider>
);
