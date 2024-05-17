import {
  AttachmentMenuAction,
  AttachmentMetadata,
  ChatMessage,
  FluentThemeProvider,
  MessageStatus,
  MessageThread,
  defaultAttachmentMenuAction
} from '@azure/communication-react';
import { initializeFileTypeIcons } from '@fluentui/react-file-type-icons';
import {
  Bookmark24Filled,
  Heart24Filled,
  Pin24Filled,
  ShareIos24Regular,
  WindowNew24Regular
} from '@fluentui/react-icons';
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
            actionsForAttachment: (
              attachment: AttachmentMetadata,
              message: ChatMessage | undefined
            ): AttachmentMenuAction[] => {
              // allows the menu actions to be dynamically generated based on the attachment content
              // (i.e. name, extension, etc.), or the message content (i.e. senderID, etc.)
              // in this example, we are constructing a dynamic menu based on the attachment extension
              const re = /(?:\.([^.]+))?$/;
              const match = re.exec(attachment.name);
              if (match && match[1] === 'pdf') {
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
              } else if (message?.senderId === 'user4') {
                // alternatively, you can return a dynamic menu based on the message metadata such as user ID
                return [
                  // you can reuse default action if you would like to
                  defaultAttachmentMenuAction,
                  // you can also overwrite the default action and reuse only a part of it
                  {
                    name: 'Bookmark',
                    icon: <Bookmark24Filled />,
                    onClick: defaultAttachmentMenuAction.onClick
                  },
                  // or you can create a new action from scratch
                  {
                    name: 'Favorite',
                    icon: <Heart24Filled />,
                    onClick: () => {
                      return new Promise((resolve) => {
                        window.alert('Favorite button clicked');
                        resolve();
                      });
                    }
                  },
                  {
                    name: 'Pin',
                    icon: <Pin24Filled />,
                    onClick: () => {
                      return new Promise((resolve) => {
                        window.alert('pin button clicked');
                        resolve();
                      });
                    }
                  }
                ];
              } else {
                // or return a static list of menu actions for all other cases
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
            messageId: '6c5c239c-905f-439e-b040-fcfdb1344df1',
            content: 'This is the report:',
            createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
            mine: false,
            attached: false,
            status: 'seen' as MessageStatus,
            contentType: 'text',
            attachments: [
              {
                id: '750e4dbd2900',
                name: 'Report.docx',
                url: 'https://www.bing.com'
              }
            ]
          },
          {
            messageType: 'chat',
            senderId: 'user3',
            senderDisplayName: 'Robert Tolbert',
            messageId: '463a7aa5-0ad7-45fb-9780-dcbf00f39c0e',
            content: 'Also take a look at this user manual as well.',
            createdOn: new Date('2019-04-13T00:00:00.000+08:00'),
            mine: false,
            attached: false,
            contentType: 'text',
            attachments: [
              {
                id: '607b3100f37a',
                name: 'Manual.pdf',
                url: 'https://www.bing.com'
              }
            ]
          },
          {
            messageType: 'chat',
            senderId: 'user4',
            senderDisplayName: 'John Doe',
            messageId: 'c6919002-f9e7-459f-89bc-3a99cb284e48',
            content: 'Great, I just need you two to sign off on this document.',
            createdOn: new Date('2019-04-13T00:00:00.000+08:00'),
            mine: true,
            attached: false,
            contentType: 'text',
            attachments: [
              {
                id: 'bv7b3100f37a',
                name: 'RSVP.xlsx',
                url: 'https://www.bing.com'
              }
            ]
          }
        ]}
      />
    </FluentThemeProvider>
  );
};
