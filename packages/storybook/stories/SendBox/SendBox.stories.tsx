// © Microsoft Corporation. All rights reserved.

import React from 'react';
import { boolean, text } from '@storybook/addon-knobs';
import { getDocs } from './SendBoxDocs';
import { SendBox } from '../../../communication-ui/src';
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
    <div style={{ width: '480px' }}>
      <SendBox
        disabled={boolean('Block button from sending', false, 'Injected by ACS Context')}
        sendMessage={async (displayname, userId, message) =>
          console.log(`sendMessage: Id ${userId} with displayName ${displayname} send a message - ${message} `)
        }
        userId={text("Sender's ACS UserId", 'ACS_ID PLACEHOLDER', 'required')}
        displayName={text("Sender's UserName", 'User Name', 'required')}
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
