import { FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import React from 'react';

initializeFileTypeIcons();

export const MessageWithAttachmentFromTeams: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        showMessageDate={true}
        messages={[
          {
            messageType: 'chat',
            senderId: '8:orgid:f949b075-4ab2-43de-8803-e01371df20a3',
            senderDisplayName: 'Kat Larsson',
            messageId: `f0a6096c-da7b-42d0-9d67-05297c926bf9`,
            content: 'Checkout these files from my OneDrive, let me know what do you think',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: false,
            attached: false,
            status: 'seen' as MessageStatus,
            contentType: 'text',
            attachments: [
              {
                id: 'a021eacd612d',
                name: 'Report.ppt',
                url: 'https://www.onedrive.com'
              },
              {
                id: 'zc1eacd612d',
                name: 'Budget.xlsx',
                url: 'https://www.bing.com'
              }
            ]
          },
          {
            messageType: 'chat',
            senderId: 'user2',
            senderDisplayName: 'Robert Tolbert',
            messageId: `2a57431b-0b86-4e37-92e9-37fc03553a9d`,
            content: 'will do, thanks!',
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
