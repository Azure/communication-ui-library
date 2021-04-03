// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ReadReceiptComponent } from '../../components';
import { Provider, teamsTheme } from '@fluentui/react-northstar';

const importStatement = `import { ReadReceiptComponent, MessageStatus } from '@azure/communication-ui';`;
const usageCode = `<ReadReceiptComponent messageStatus={MessageStatus.DELIVERED} />
<ReadReceiptComponent messageStatus={MessageStatus.SEEN} />
<ReadReceiptComponent messageStatus={MessageStatus.SENDING} />
<ReadReceiptComponent messageStatus={MessageStatus.FAILED} />`;

const ExampleReadReceipts: () => JSX.Element = () => (
  <>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'delivered'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'seen'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'sending'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceiptComponent messageStatus={'failed'} />
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
