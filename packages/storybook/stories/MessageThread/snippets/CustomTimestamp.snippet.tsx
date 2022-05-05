import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { GetHistoryChatMessages } from './placeholdermessages';

export const MessageThreadWithCustomTimestampExample: () => JSX.Element = () => {
  // Customize the Timestamp format for messages
  const dateTimeFormat = (messageDate: Date): string => {
    let hours = messageDate.getHours();
    let minutes = messageDate.getMinutes().toString();
    const isAm = hours < 12;
    if (hours > 12) {
      hours = hours - 12;
    }
    if (hours === 0) {
      hours = 12;
    }
    if (minutes.length < 2) {
      minutes = '0' + minutes;
    }
    return 'TimeStamp: ' + hours.toString() + ':' + minutes + ' ' + (isAm ? 'a.m.' : 'p.m.');
  };
  return (
    <FluentThemeProvider>
      <MessageThread userId={'1'} messages={GetHistoryChatMessages()} dateTimeFormat={dateTimeFormat} />
    </FluentThemeProvider>
  );
};
