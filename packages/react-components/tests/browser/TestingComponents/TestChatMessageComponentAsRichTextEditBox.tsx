// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useLocale } from '../../../src/localization';
import { ChatMessageComponentAsRichTextEditBox } from '../../../src/components/ChatMessage/MyMessageComponents/ChatMessageComponentAsRichTextEditBox';
import { MessageStatus } from '@internal/acs-ui-common';
import { Message } from '../../../src/types/ChatMessage';

interface TestChatMessageComponentAsRichTextEditBoxProps {
  failureReason?: string;
}

const message: Message = {
  messageType: 'chat',
  senderId: 'user1',
  senderDisplayName: 'Kat Larsson',
  messageId: Math.random().toString(),
  content: 'Hi everyone, I created this awesome group chat for us!',
  createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
  mine: true,
  attached: false,
  status: 'seen' as MessageStatus,
  contentType: 'html'
};

/**
 * @private
 */
export const TestChatMessageComponentAsRichTextEditBox = (
  props: TestChatMessageComponentAsRichTextEditBoxProps
): JSX.Element => {
  const { failureReason } = props;
  const locale = useLocale();
  return (
    <ChatMessageComponentAsRichTextEditBox
      message={{ ...message, failureReason }}
      onSubmit={async () => {
        return;
      }}
      strings={locale.strings.messageThread}
    />
  );
};
