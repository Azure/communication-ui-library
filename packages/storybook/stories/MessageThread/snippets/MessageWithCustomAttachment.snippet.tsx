import {
  AttachmentMenuAction,
  AttachmentMetadata,
  FluentThemeProvider,
  MessageStatus,
  MessageThread,
  defaultAttachmentMenuAction
} from '@azure/communication-react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import { ShareIos24Regular, WindowNew24Regular } from '@fluentui/react-icons';
import React from 'react';

initializeFileTypeIcons();

export const MessageWithCustomAttachment: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        showMessageDate={true}
        attachmentOptions={{
          downloadOptions: {
            actionsForAttachment: (attachment: AttachmentMetadata): AttachmentMenuAction[] => {
              // allows the menu actions to be dynamically generated based on the attachment content
              // (i.e. name, extension, etc.), or the message content (i.e. senderID, etc.)
              // in this example, we are constructing a dynamic menu based on the attachment extension
              if (attachment.extension === 'pdf') {
                return [
                  {
                    name: 'Share',
                    icon: <ShareIos24Regular />,
                    onClick: () => {
                      return new Promise((resolve) => {
                        window.alert('share button clicked');
                        resolve();
                      });
                    }
                  }
                ];
              } else {
                return [
                  {
                    ...defaultAttachmentMenuAction,
                    onClick: () => {
                      return new Promise((resolve) => {
                        window.alert('download button clicked');
                        resolve();
                      });
                    }
                  },
                  {
                    name: 'Open',
                    icon: <WindowNew24Regular />,
                    onClick: () => {
                      return new Promise((resolve) => {
                        window.alert('open button clicked');
                        resolve();
                      });
                    }
                  }
                ];
              }
            }
          }
        }}
        messages={[
          {
            messageType: 'chat',
            senderId: 'user1',
            senderDisplayName: 'Kat Larsson',
            messageId: Math.random().toString(),
            content: 'This is the report:',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: false,
            attached: false,
            status: 'seen' as MessageStatus,
            contentType: 'text',
            attachments: [
              {
                id: 'SomeUniqueId1',
                name: 'Report.docx',
                extension: 'docx',
                url: 'https://<file_url>/report.docx'
              }
            ]
          },
          {
            messageType: 'chat',
            senderId: 'user3',
            senderDisplayName: 'Robert Tolbert',
            messageId: Math.random().toString(),
            content: 'Also take a look at this user manual as well.',
            createdOn: new Date('2019-04-13T00:00:00.000+08:00'),
            mine: false,
            attached: false,
            contentType: 'text',
            attachments: [
              {
                id: 'SomeUniqueId2',
                name: 'Manual.pdf',
                extension: 'pdf',
                url: 'https://<file_url>/manual.pdf'
              }
            ]
          }
        ]}
      />
    </FluentThemeProvider>
  );
};
