// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { FluentThemeProvider, MessageThread } from '@azure/communication-react';
import React from 'react';
import { ArgsFrom } from '../../../controlsUtils';
import { GetHistoryChatMessages } from '../snippets/placeholdermessages';

const storyControls = {
  showCustomTimestamp: { control: 'boolean', name: 'Show Custom Timestamp' }
};

const CustomTimestampStory = (args: ArgsFrom<typeof storyControls>): JSX.Element => {
  // Customize the Timestamp format for messages
  const onDisplayDateTimeString = (messageDate: Date): string => {
    let hours = messageDate.getHours();
    let minutes = messageDate.getMinutes().toString();
    let month = (messageDate.getMonth() + 1).toString();
    let day = messageDate.getDate().toString();
    const year = messageDate.getFullYear().toString();
    if (month.length === 1) {
      month = '0' + month;
    }
    if (day.length === 1) {
      day = '0' + day;
    }
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
    return (
      'TimeStamp: ' +
      year +
      '-' +
      month +
      '-' +
      day +
      ', ' +
      hours.toString() +
      ':' +
      minutes +
      ' ' +
      (isAm ? 'a.m.' : 'p.m.')
    );
  };

  return (
    <FluentThemeProvider>
      <MessageThread
        userId={'1'}
        messages={GetHistoryChatMessages()}
        showMessageDate={args.showCustomTimestamp ? false : true}
        onDisplayDateTimeString={args.showCustomTimestamp ? onDisplayDateTimeString : undefined}
      />
    </FluentThemeProvider>
  );
};

export const MessageThreadCustomTimestamp = CustomTimestampStory.bind({});
