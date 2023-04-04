import { FluentThemeProvider, MessageStatus, MessageThread } from '@azure/communication-react';
import React from 'react';

export const MessageWithFile: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        showMessageDate={true}
        messages={[
          {
            messageType: 'chat',
            senderId: 'user1',
            senderDisplayName: 'Kat Larsson',
            messageId: Math.random().toString(),
            content: 'Here is my router configuration file.',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: false,
            attached: false,
            status: 'seen' as MessageStatus,
            contentType: 'text',
            attachedFilesMetadata: [
              {
                name: 'RouterConfig.xlsx',
                extension: 'xlsx',
                url: 'https://www.example.com/files/RouterConfig.xlsx',
                attachmentType: 'fileSharing',
                id: ''
              }
            ]
          },
          {
            messageType: 'chat',
            senderId: 'user2',
            senderDisplayName: 'Robert Tolbert',
            messageId: Math.random().toString(),
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
