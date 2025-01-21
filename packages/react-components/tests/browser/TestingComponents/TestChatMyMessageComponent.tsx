// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useLocale } from '../../../src/localization';
import { MessageContentType } from '../../../src/types/ChatMessage';
import { FluentV9ThemeProvider } from '../../../src/theming/FluentV9ThemeProvider';
import { useTheme } from '../../../src';
import { ChatMyMessageComponent } from '../../../src/components/ChatMessage/MyMessageComponents/ChatMyMessageComponent';

interface TestChatMyMessageComponentProps {
  content: string;
  contentType: MessageContentType;
  isRichTextEditorEnabled: boolean;
}

/**
 * @private
 */
export const TestChatMyMessageComponent = (props: TestChatMyMessageComponentProps): JSX.Element => {
  const { content, contentType, isRichTextEditorEnabled } = props;
  const locale = useLocale();
  const theme = useTheme();

  return (
    <FluentV9ThemeProvider v8Theme={theme}>
      <ChatMyMessageComponent
        shouldOverlapAvatarAndMessage={false}
        onActionButtonClick={() => {}}
        strings={locale.strings.messageThread}
        message={{
          messageType: 'chat',
          senderId: 'user2',
          senderDisplayName: 'Test user 2',
          messageId: Math.random().toString(),
          content: content,
          createdOn: new Date('2019-04-13T00:00:00.000+08:10'),
          mine: true,
          attached: false,
          contentType: contentType,
          attachments: [
            {
              url: '',
              name: 'image.png',
              id: '1'
            }
          ]
        }}
        userId={'1'}
        isRichTextEditorEnabled={isRichTextEditorEnabled}
      />
    </FluentV9ThemeProvider>
  );
};
