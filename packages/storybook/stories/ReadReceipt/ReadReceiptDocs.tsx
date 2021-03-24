// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { MessageStatus, ReadReceiptComponent } from '@azure/communication-ui';
import { Provider, teamsTheme } from '@fluentui/react-northstar';

const importStatement = `import { ReadReceiptComponent, MessageStatus } from '@azure/communication-ui';`;
const usageCode = `<ReadReceiptComponent messageStatus={MessageStatus.DELIVERED} />
<ReadReceiptComponent messageStatus={MessageStatus.SEEN} />
<ReadReceiptComponent messageStatus={MessageStatus.SENDING} />
<ReadReceiptComponent messageStatus={MessageStatus.FAILED} />`;

const ExampleReadReceipts: () => JSX.Element = () => (
  <>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={MessageStatus.DELIVERED} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={MessageStatus.SEEN} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={MessageStatus.SENDING} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={MessageStatus.FAILED} />
    </span>
  </>
);

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ReadReceipts</Title>
      <Description>
        Read Receipt is used to indicate whether a message has been read, delivered, currently sending, or failed to
        send.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <Provider theme={teamsTheme}>
          <ExampleReadReceipts />
        </Provider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Props</Heading>
      <Props of={ReadReceiptComponent} />
    </>
  );
};
