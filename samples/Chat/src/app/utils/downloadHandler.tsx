// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AttachmentMetadata, defaultAttachmentMenuAction } from '@azure/communication-react';
import { WindowNew24Regular } from '@fluentui/react-icons';
import React from 'react';

const attachmentDownloadOptions = {
  actionsForAttachment: (attachment: AttachmentMetadata) => {
    if (attachment.extension === 'pdf') {
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

export default attachmentDownloadOptions;
