import React from 'react';
import { SendBox, FluentThemeProvider } from 'react-components';
import { Icon } from '@fluentui/react';

export const CustomIconExample: () => JSX.Element = () => (
  <FluentThemeProvider>
    <div style={{ width: '31.25rem' }}>
      <SendBox
        onMessageSend={async () => {
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
