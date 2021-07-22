// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallControls } from '../CallComposite/CallControls';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { ChatButton } from './ChatButton';
import { PeopleButton } from './PeopleButton';
import { Stack } from '@fluentui/react';

export interface MeetingCallControlBarProps {
  callAdapter: CallAdapter;
  onEndCallClick: () => void;
  chatButtonChecked: boolean;
  peopleButtonChecked: boolean;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
}

export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  return (
    <Stack horizontal>
      <Stack.Item grow>
        <CallAdapterProvider adapter={props.callAdapter}>
          <CallControls onEndCallClick={props.onEndCallClick} showParticipantsControl={false} />
        </CallAdapterProvider>
      </Stack.Item>
      <Stack.Item>
        <ChatButton checked={props.chatButtonChecked} showLabel={true} onClick={props.onChatButtonClicked} />
        <PeopleButton checked={props.peopleButtonChecked} showLabel={true} onClick={props.onPeopleButtonClicked} />
      </Stack.Item>
    </Stack>
  );
};
