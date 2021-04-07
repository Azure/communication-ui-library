// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { boolean, text } from '@storybook/addon-knobs';
import { getDocs } from './SendBoxDocs';
import { SendBox } from '@azure/communication-ui';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { Meta } from '@storybook/react/types-6-0';

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/SendBox`,
  component: SendBox,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

export const SendBoxComponent = (): JSX.Element => {
  return (
    <div style={{ width: '31.25rem' }}>
      <SendBox
        disabled={boolean('Block button from sending', false, 'Injected by ACS Context')}
        onSendMessage={async (message) => alert(`sent message: ${message} `)}
        onSendTypingNotification={(): Promise<void> => {
          console.log(`sending typing notifications`);
          return Promise.resolve();
        }}
        systemMessage={text(
          'Warning/information message for sendBox',
          'Please wait 30 seconds to send new messages',
          'Injected by ACS Context'
        )}
      />
    </div>
  );
};
