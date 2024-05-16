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
