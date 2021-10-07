// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallControls, CallControlOptions } from '../CallComposite/CallControls';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { ChatButton } from './ChatButton';
import { PeopleButton } from './PeopleButton';
import { Stack } from '@fluentui/react';

/**
 * @private
 */
export interface MeetingCallControlBarProps {
  callAdapter: CallAdapter;
  onEndCallClick: () => void;
  chatButtonChecked: boolean;
  peopleButtonChecked: boolean;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  mobileView?: boolean;
}

/**
 * @private
 */
export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  const callControlsOptions: CallControlOptions = {
    participantsButton: false,
    screenShareButton: props.mobileView,
    compressedMode: props.mobileView
  };

  return (
    <Stack horizontal>
      <Stack.Item grow>
        <CallAdapterProvider adapter={props.callAdapter}>
          <CallControls
            onEndCallClick={props.onEndCallClick}
            options={callControlsOptions}
            /** On desktop we set the camera button as the first item in the controls bar. */
            firstButton={props?.mobileView ? 'microphone' : 'camera'}
          />
        </CallAdapterProvider>
      </Stack.Item>
      <Stack.Item>
        <ChatButton
          checked={props.chatButtonChecked}
          showLabel={true}
          onClick={props.onChatButtonClicked}
          data-ui-id="meeting-composite-chat-button"
        />
        <PeopleButton
          checked={props.peopleButtonChecked}
          showLabel={true}
          onClick={props.onPeopleButtonClicked}
          data-ui-id="meeting-composite-people-button"
        />
      </Stack.Item>
    </Stack>
  );
};
