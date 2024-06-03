// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata, defaultAttachmentMenuAction } from '@azure/communication-react';

/* @conditional-compile-remove(file-sharing-acs) */
import { WindowNew24Regular } from '@fluentui/react-icons';
/* @conditional-compile-remove(file-sharing-acs) */
import React from 'react';

/* @conditional-compile-remove(file-sharing-acs) */
export const attachmentDownloadOptions = {
  actionsForAttachment: () => {
    // if download option is not defined, default download option will be used
    // we are manually returning default download option here as an example
    // but you don't have to do this if you want to use default download option
    return [defaultAttachmentMenuAction];
  }
};

/* @conditional-compile-remove(file-sharing-acs) */
export const attachmentDownloadOptionsWithCustomButtons = {
  actionsForAttachment: (attachment: AttachmentMetadata) => {
    // This is an example of how to add a custom action to the attachment menu
    // You can make the list of menu actions to be dynamic based on the
    // the attachment metadata such as the file extension, file name, etc, OR
    // based on the message metadata such as the sender ID, message type, etc.
    const re = /(?:\.([^.]+))?$/;
    const match = re.exec(attachment.name);
    if (match && match[1] === 'pdf') {
      return [
        {
          ...defaultAttachmentMenuAction,
          onClick: (attachment: AttachmentMetadata) => {
            return new Promise<void>((resolve) => {
              window.open(attachment.url, '_blank');
              resolve();
            });
          }
        },
        {
          name: 'open',
          icon: <WindowNew24Regular />,
          onClick: (attachment: AttachmentMetadata) => {
            return new Promise<void>((resolve) => {
              window.open(attachment.url, '_blank');
              resolve();
            });
          }
        }
      ];
    }
    // Alternatively, you can also overwrite the default attachment menu action partially
    // In this example, we are reusing the default action name and icon, but changing the onClick behavior
    return [
      {
        name: defaultAttachmentMenuAction.name,
        icon: defaultAttachmentMenuAction.icon,
        onClick: (attachment: AttachmentMetadata) => {
          return new Promise<void>((resolve) => {
            window.alert('file you are trying to open is' + attachment.name);
            resolve();
          });
        }
      }
    ];
  }
};
