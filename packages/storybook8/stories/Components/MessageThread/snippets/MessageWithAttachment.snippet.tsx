import { FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React from 'react';

initializeFileTypeIcons();

export const MessageWithAttachment: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        showMessageDate={true}
        messages={[
          {
            messageType: 'chat',
            senderId: '8:acs:7a7894bb-0d53-4fe8-b83e-dce84ade5e89',
            senderDisplayName: 'Robert Tolbert',
            messageId: `64d334be-f30c-4218-bc1c-853a28512187`,
            content: 'Here is my router configuration file',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: false,
            attached: false,
            status: 'seen' as MessageStatus,
            contentType: 'text',
            attachments: [
              {
                id: 'p121eacd612d',
                name: 'RouterConfig.txt',
                url: 'https://www.bing.com'
              }
            ]
          },
          {
            messageType: 'chat',
            senderId: 'user2',
            senderDisplayName: 'Kat Larsson',
            messageId: `348eda2f-1582-4f29-bb5d-cda7295ca398`,
            content: 'Thanks for sharing. This will help me troubleshoot your internet connection.',
            createdOn: new Date('2019-04-13T00:00:00.000+08:09'),
            mine: true,
            attached: false,
            contentType: 'text'
          }
        ]}
      />
    </FluentThemeProvider>
  );
};
