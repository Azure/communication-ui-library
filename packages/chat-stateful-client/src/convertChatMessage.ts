// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatMessage } from '@azure/communication-chat';
import { MessageStatus } from '@internal/acs-ui-common';
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';

/**
 * @private
 */
export const convertChatMessage = (
  message: ChatMessage,
  status: MessageStatus = 'delivered',
  clientMessageId?: string
): ChatMessageWithStatus => {

  if (message.content?.message?.includes('')) {
    var div = document.createElement('div');
    div.innerHTML = message.content?.message;
    var images = [...div.getElementsByTagName('img')];
    images.forEach(element => {
      message.content?.attachments?.push(
        {
          "id": element.id,
          "name": "image",
          "attachmentType": "teamsInlineImage",
          "url": "" + "/chat/threads/123456789/messages/123456789/teamsInterop/images/" + element.id + "/views/original?api-version=2023-04-01-preview",
          "previewUrl": "" + "/chat/threads/123456789/messages/123456789/teamsInterop/images/" + element.id + "/views/small?api-version=2023-04-01-preview"
        }
      )
      element?.setAttribute('src', '');
      element?.setAttribute('itemtype', '');
      element?.setAttribute('href', '');
      element?.setAttribute('target-src', '');
    });
    message.content.message = div.innerHTML;
  }

  return {
    ...message,
    clientMessageId: clientMessageId,
    status,
    /* @conditional-compile-remove(data-loss-prevention) */
    policyViolation: !!(
      message.sender?.kind === 'microsoftTeamsUser' &&
      !!message.editedOn &&
      message.content?.message === ''
    )
  };
};
