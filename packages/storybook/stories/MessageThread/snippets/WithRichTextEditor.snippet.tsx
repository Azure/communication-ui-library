import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { GetHistoryHTMLChatMessages } from './placeholdermessages';

export const MessageThreadWithRichTextEditorExample: () => JSX.Element = () => {
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} richTextEditor={true} messages={GetHistoryHTMLChatMessages()} />
    </FluentThemeProvider>
  );
};
