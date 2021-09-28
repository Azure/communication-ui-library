import { FluentThemeProvider, MessageThread, MessageThreadStyles } from '@azure/communication-react';
import React from 'react';
import { GetHistoryWithSystemMessages } from './placeholdermessages';

export const MessageThreadWithCustomMessageContainerExample: () => JSX.Element = () => {
  const messageThreadStyle: MessageThreadStyles = {
    chatMessageContainer: (mine: boolean) => {
      return {
        fontStyle: 'italic',
        boxShadow: '0px 3.2px 7.2px rgb(0 0 0 / 13\u0025), 0px 0.6px 1.8px rgb(0 0 0 / 11\u0025)'
      };
    },
    systemMessageContainer: { fontWeight: 'bold', border: 'double red' }
  };

  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} styles={messageThreadStyle} messages={GetHistoryWithSystemMessages()} />
    </FluentThemeProvider>
  );
};
