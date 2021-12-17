// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallControls, CallControlOptions } from '../CallComposite/components/CallControls';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { ChatButton } from './ChatButton';
import { PeopleButton } from './PeopleButton';
import { mergeStyles, Stack } from '@fluentui/react';
import { reduceCallControlsForMobile } from '../CallComposite/utils';
import { controlBarContainerStyles } from '../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../CallComposite/styles/CallPage.styles';
import { MeetingCallControlOptions } from './MeetingComposite';
/**
 * @private
 */
export interface MeetingCallControlBarProps {
  callAdapter: CallAdapter;
  chatButtonChecked: boolean;
  peopleButtonChecked: boolean;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  mobileView: boolean;
  disableButtonsForLobbyPage: boolean;
  meetingCallControlOptions?: MeetingCallControlOptions;
}

/**
 * @private
 */
export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  // Set the desired control buttons from the meetings composite. particiapantsButton is always false since there is the peopleButton.
  let callControlsOptions: CallControlOptions | false = {
    participantsButton: false,
    screenShareButton:
      props.mobileView || !props.meetingCallControlOptions?.screenShareButton
        ? false
        : { disabled: props.disableButtonsForLobbyPage },
    displayType: props.meetingCallControlOptions?.displayType,
    microphoneButton: !props.meetingCallControlOptions?.microphoneButton ? false : true,
    cameraButton: !props.meetingCallControlOptions?.cameraButton ? false : true,
    devicesButton: !props.meetingCallControlOptions?.devicesButton ? false : true
  };
  // Set flags for the chat button and people button specific to the meeting control bar.
  const chatButton = props.meetingCallControlOptions?.chatButton === false ? false : true;
  const peopleButton = props.meetingCallControlOptions?.peopleButton === false ? false : true;
  console.log(callControlsOptions);

  // Reduce the controls shown when mobile view is enabled.
  if (props.mobileView) {
    callControlsOptions = reduceCallControlsForMobile(callControlsOptions);
  }

  /**
   * Until mobile meetings is worked on, statically set the width of the
   * control bar such that all controls can be accessed.
   */
  const temporaryMeetingControlBarStyles = props.mobileView ? { width: '23.5rem' } : undefined;

  return (
    <Stack
      horizontal
      className={mergeStyles(temporaryMeetingControlBarStyles, callControlsContainerStyles, controlBarContainerStyles)}
    >
      <Stack.Item grow>
        <CallAdapterProvider adapter={props.callAdapter}>
          <CallControls options={callControlsOptions} increaseFlyoutItemSize={props.mobileView} />
        </CallAdapterProvider>
      </Stack.Item>
      <Stack.Item>
        {chatButton !== false && (
          <ChatButton
            checked={props.chatButtonChecked}
            showLabel={true}
            onClick={props.onChatButtonClicked}
            data-ui-id="meeting-composite-chat-button"
            disabled={props.disableButtonsForLobbyPage}
          />
        )}
        {peopleButton !== false && (
          <PeopleButton
            checked={props.peopleButtonChecked}
            showLabel={true}
            onClick={props.onPeopleButtonClicked}
            data-ui-id="meeting-composite-people-button"
            disabled={props.disableButtonsForLobbyPage}
          />
        )}
      </Stack.Item>
    </Stack>
  );
};
