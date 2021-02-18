// © Microsoft Corporation. All rights reserved.
import React from 'react';
import { Title, Description, Props, Heading, Source, Canvas } from '@storybook/addon-docs/blocks';
import { ReadReceiptComponent } from '../../components';
import { MessageStatus } from '../../types';
import { Provider } from '@fluentui/react-northstar';

// @ts-ignore silence the typescript error, we can only use commonjsto make storybook use this icon correctly
import { svgIconStyles } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconStyles';
// @ts-ignore
import { svgIconVariables } from '@fluentui/react-northstar/dist/commonjs/themes/teams/components/SvgIcon/svgIconVariables';
// @ts-ignore
import * as siteVariables from '@fluentui/react-northstar/dist/commonjs/themes/teams/siteVariables';

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

const iconTheme = {
  componentStyles: {
    SvgIcon: svgIconStyles
  },
  componentVariables: {
    SvgIcon: svgIconVariables
  },
  siteVariables
};

export const getDocs: () => JSX.Element = () => {
  return (
    <>
      <Title>ReadReceipt</Title>
      <Description>
        Read Receipt is used to indicate whether a message has been read, delivered, currently sending, or failed to
        send.
      </Description>
      <Heading>Importing</Heading>
      <Source code={importStatement} />
      <Heading>Example</Heading>
      <Canvas>
        <Provider theme={iconTheme}>
          <ExampleReadReceipts />
        </Provider>
      </Canvas>
      <Source code={usageCode} />
      <Heading>Props</Heading>
      <Props of={ReadReceiptComponent} />
    </>
  );
};
