// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ReadReceipt } from '@azure/communication-ui';
import { Provider, teamsTheme } from '@fluentui/react-northstar';

const importStatement = `import { ReadReceipt, MessageStatus } from '@azure/communication-ui';`;
const usageCode = `<ReadReceipt messageStatus={MessageStatus.DELIVERED} />
<ReadReceipt messageStatus={MessageStatus.SEEN} />
<ReadReceipt messageStatus={MessageStatus.SENDING} />
<ReadReceipt messageStatus={MessageStatus.FAILED} />`;

const ExampleReadReceipts: () => JSX.Element = () => (
  <>
    <span style={{ margin: '0 5px' }}>
      <ReadReceipt messageStatus={'delivered'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceipt messageStatus={'seen'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceipt messageStatus={'sending'} />
    </span>
    <span style={{ margin: '0 5px' }}>
      <ReadReceipt messageStatus={'failed'} />
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
      <Props of={ReadReceipt} />
    </>
  );
};
