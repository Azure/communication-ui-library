// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { Icon, Stack } from '@fluentui/react';
import { AttachmentMenuAction, MessageThread, defaultAttachmentMenuAction } from '../../../src';
import React from 'react';

/**
 * @private
 */
export const TestMessageThreadWithCustomAttachmentActions = (): JSX.Element => {
  const attachmentActions = (attachment, message): AttachmentMenuAction[] => {
    return [
      defaultAttachmentMenuAction,
      {
        icon: <Icon iconName="OpenAttachment" />,
        name: 'Open',
        onClick: async () => {
          window.alert(
            'Open attachment clicked, opening ' + attachment.name + ' for message with id ' + message.messageId
          );
          return Promise.resolve();
        }
      }
    ];
  };
  return (
    <Stack style={{ height: '210px', width: '100%' }}>
      <MessageThread
        userId={'8:acs:12345'}
        attachmentOptions={{
          downloadOptions: {
            actionsForAttachment: attachmentActions
          }
        }}
        messages={[
          {
            contentType: 'text',
            messageType: 'chat',
            messageId: '1234567890',
            createdOn: new Date('01-01-2024'),
            senderId: '8:acs:12345',
            senderDisplayName: 'John Doe',
            content: 'Custom Action Test',
            mine: true,
            attachments: [{ name: 'test1.docx', id: '854f29c09740', url: 'https://www.contoso.com/test1.docx' }]
          }
        ]}
      />
    </Stack>
  );
};
