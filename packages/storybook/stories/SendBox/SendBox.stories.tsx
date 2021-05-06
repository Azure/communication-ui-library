// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { boolean, text } from '@storybook/addon-knobs';
import { getDocs } from './SendBoxDocs';
import { SendBox as SendBoxComponent } from '@azure/communication-react';
import { COMPONENT_FOLDER_PREFIX } from '../constants';
import { Meta } from '@storybook/react/types-6-0';

export default {
  title: `${COMPONENT_FOLDER_PREFIX}/Send Box`,
  component: SendBoxComponent,
  parameters: {
    docs: {
      page: () => getDocs()
    }
  }
} as Meta;

// This must be the only named export from this module, and must be named to match the storybook path suffix.
// This ensures that storybook hoists the story instead of creating a folder with a single entry.
export const SendBox = (): JSX.Element => {
  return (
    <div style={{ width: '31.25rem' }}>
      <SendBoxComponent
        disabled={boolean('Block button from sending', false, 'Injected by ACS Context')}
        onMessageSend={async (message) => alert(`sent message: ${message} `)}
        onTyping={(): Promise<void> => {
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
