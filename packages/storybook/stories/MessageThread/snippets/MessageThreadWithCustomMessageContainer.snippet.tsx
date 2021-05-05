import { FluentThemeProvider, MessageThread } from 'react-components';
import React from 'react';
import { GetHistoryWithSystemMessages } from './placeholdermessages';

export const MessageThreadWithCustomMessageContainerExample: () => JSX.Element = () => {
  // Show a customized message containers.
  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        styles={{
          chatMessageContainer: {
            fontStyle: 'italic',
            boxShadow: '0px 3.2px 7.2px rgb(0 0 0 / 13%), 0px 0.6px 1.8px rgb(0 0 0 / 11%)'
          },
          systemMessageContainer: { fontWeight: 'bold', border: 'double red' }
        }}
        messages={GetHistoryWithSystemMessages()}
      />
    </FluentThemeProvider>
  );
};
