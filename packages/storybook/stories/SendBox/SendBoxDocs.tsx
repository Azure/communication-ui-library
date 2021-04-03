// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Icon } from '@fluentui/react';

import { FluentThemeProvider, SendBox } from '@azure/communication-ui';

const importStatement = `import { SendBox } from '@azure/communication-ui';`;
const usageCode = `
<div style={{ width: '400px', margin: '0 5px' }}>
  <SendBox
    disabled={false}
    sendMessage={async () => {
      return;
    }}
    userId="UserId1"
    displayName="User Name"
    onSendTypingNotification={(): Promise<void> => {
      return Promise.resolve();
    }}
  />
</div>
<div style={{ width: '400px', margin: '0 5px' }}>
  <SendBox
    disabled={false}
    sendMessage={async () => {
      return;
    }}
    userId="UserId2"
    displayName="User Name"
    onSendTypingNotification={(): Promise<void> => {
      return Promise.resolve();
    }}
    systemMessage="Please wait 30 seconds to send new messages"
  />
</div>`;

const ExampleSendBox: () => JSX.Element = () => (
  <>
    <div style={{ width: '400px', margin: '0 5px' }}>
      <SendBox
        disabled={false}
        sendMessage={async () => {
          return;
        }}
        userId="UserId1"
        displayName="User Name"
        onSendTypingNotification={(): Promise<void> => {
          return Promise.resolve();
        }}
      />
    </div>
    <div style={{ width: '400px', margin: '0 5px' }}>
      <SendBox
        disabled={false}
        sendMessage={async () => {
          return;
        }}
        userId="UserId2"
        displayName="User Name"
        onSendTypingNotification={(): Promise<void> => {
          return Promise.resolve();
        }}
        systemMessage="Please wait 30 seconds to send new messages"
      />
    </div>
  </>
);

const CustomIconExample: () => JSX.Element = () => (
  <div style={{ width: '400px' }}>
    <SendBox
      disabled={false}
      sendMessage={async () => {
        return;
      }}
      userId="UserId3"
      displayName="User Name"
      onSendTypingNotification={(): Promise<void> => {
        return Promise.resolve();
      }}
      onRenderIcon={() => <Icon iconName="AirplaneSolid" />}
    />
  </div>
);

const customIconCode = `
<div style={{ width: '400px' }}>
  <SendBox
    disabled={false}
    sendMessage={async () => {
      return;
    }}
    userId="UserId3"
    displayName="User Name"
    onSendTypingNotification={(): Promise<void> => {
      return Promise.resolve();
    }}
    onRenderIcon={() => <Icon iconName="AirplaneSolid" />}
  />
</div>`;

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>SendBox</Title>
      <Description>
        SendBox is component used for message/typing notification sending, it is also able to show system messages
        related to message sending
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <FluentThemeProvider>
          <ExampleSendBox />
        </FluentThemeProvider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Custom send icon</Heading>
      To customize the send icon, use the onRenderIcon property like in the example below.
      <Source code={customIconCode} />
      <Canvas>
        <FluentThemeProvider>
          <CustomIconExample />
        </FluentThemeProvider>
      </Canvas>
      <Heading>Props</Heading>
      <Props of={SendBox} />
    </>
  );
};
