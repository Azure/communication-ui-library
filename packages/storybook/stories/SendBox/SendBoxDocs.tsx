// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Icon } from '@fluentui/react';

import { FluentThemeProvider, SendBox } from '@azure/communication-ui';

const importStatement = `import { SendBoxComponent } from '@azure/communication-ui';`;

const ExampleSendBox: () => JSX.Element = () => (
  <div style={{ width: '400px', margin: '0 5px' }}>
    <SendBox
      onSendMessage={async () => {
        return;
      }}
      onSendTypingNotification={(): Promise<void> => {
        return Promise.resolve();
      }}
    />
  </div>
);

const exampleSendBoxCode = `
<div style={{ width: '400px', margin: '0 5px' }}>
  <SendBoxComponent
    onSendMessage={async () => {
      return;
    }}
    onSendTypingNotification={(): Promise<void> => {
      return Promise.resolve();
    }}
  />
</div>
`;

const SendBoxWithSystemMessage: () => JSX.Element = () => (
  <div style={{ width: '400px', margin: '0 5px' }}>
    <SendBox
      onSendMessage={async () => {
        return;
      }}
      onSendTypingNotification={(): Promise<void> => {
        return Promise.resolve();
      }}
      systemMessage="Please wait 30 seconds to send new messages"
    />
  </div>
);

const sendBoxWithSystemMessageCode = `
<div style={{ width: '400px', margin: '0 5px' }}>
<SendBox
  onSendMessage={async () => {
    return;
  }}
  onSendTypingNotification={(): Promise<void> => {
    return Promise.resolve();
  }}
  systemMessage="Please wait 30 seconds to send new messages"
/>
</div>
`;

const CustomIconExample: () => JSX.Element = () => (
  <div style={{ width: '400px' }}>
    <SendBox
      onSendMessage={async () => {
        return;
      }}
      onSendTypingNotification={(): Promise<void> => {
        return Promise.resolve();
      }}
      onRenderIcon={() => <Icon iconName="AirplaneSolid" />}
    />
  </div>
);

const customIconCode = `
import { Icon } from '@fluentui/react';

<div style={{ width: '400px' }}>
  <SendBox
    onSendMessage={async () => {
      return;
    }}
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
        `SendBox` is a component for users to send messages and typing notifications. An optional message can also be
        shown below the `SendBox`.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <FluentThemeProvider>
          <ExampleSendBox />
        </FluentThemeProvider>
      </Canvas>
      <Source code={exampleSendBoxCode} />
      <Heading>Add a system message</Heading>
      To add a system message, use the systemMessage property like in the example below.
      <Source code={sendBoxWithSystemMessageCode} />
      <Canvas>
        <FluentThemeProvider>
          <SendBoxWithSystemMessage />
        </FluentThemeProvider>
      </Canvas>
      <Heading>Customize send icon</Heading>
      <Description>
        To customize the send icon, use the onRenderIcon property like in the example below. A [Fluent UI
        Icon](https://developer.microsoft.com/en-us/fluentui#/controls/web/icon) is used in this example but you can use
        any `JSX.Element`.
      </Description>
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
