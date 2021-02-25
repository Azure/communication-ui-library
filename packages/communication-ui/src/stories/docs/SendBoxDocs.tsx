// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { Provider, teamsTheme } from '@fluentui/react-northstar';

import { SendBoxComponent } from '../../components';

const importStatement = `import { SendBoxComponent } from '@azure/communication-ui';`;
const usageCode = `<SendBoxComponent
disabled={false}
sendMessage={async () => { return }}
userId='ACS_ID PLACEHOLDER'
displayName='User Name'
onSendTypingNotification={() => { return }}
/>
<SendBoxComponent
disabled={false}
sendMessage={async () => { return }}
userId='ACS_ID PLACEHOLDER'
displayName='User Name'
onSendTypingNotification={() => { return }}
systemMessage='Please wait 30 seconds to send new messages'
/>`;

const ExampleSendBox: () => JSX.Element = () => (
  <>
    <span style={{ margin: '0 5px' }}>
      <SendBoxComponent
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
    </span>
    <span style={{ margin: '0 5px' }}>
      <SendBoxComponent
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
    </span>
  </>
);

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
        <Provider theme={teamsTheme}>
          <ExampleSendBox />
        </Provider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Props</Heading>
      <Props of={SendBoxComponent} />
    </>
  );
};
