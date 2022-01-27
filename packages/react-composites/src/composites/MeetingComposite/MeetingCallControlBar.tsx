// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CallControlOptions, CallControls } from '../CallComposite/components/CallControls';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { CallAdapter } from '../CallComposite';
import { ChatButton } from './ChatButton';
import { PeopleButton } from './PeopleButton';
import { mergeStyles, Stack } from '@fluentui/react';
import { reduceCallControlsForMobile } from '../CallComposite/utils';
import { controlBarContainerStyles } from '../CallComposite/styles/CallControls.styles';
import { callControlsContainerStyles } from '../CallComposite/styles/CallPage.styles';
import { MeetingCallControlOptions } from './MeetingComposite';
import { useMeetingCompositeStrings } from './hooks/useMeetingCompositeStrings';
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
  callControls?: boolean | MeetingCallControlOptions;
}

const inferMeetingCallControlOptions = (
  meetingControls?: boolean | MeetingCallControlOptions
): MeetingCallControlOptions | false | undefined => {
  if (typeof meetingControls !== 'boolean') {
    return meetingControls;
  }
  if (meetingControls === true) {
    // return empty object so buttons in the meetingCallControlOptions set render in their defualt behaviors.
    return undefined;
  }
  // callControls === false
  return false;
};

const inferCallControlOptions = (
  callControls?: boolean | CallControlOptions
): CallControlOptions | false | undefined => {
  if (typeof callControls !== 'boolean') {
    callControls === undefined
      ? (callControls = { participantsButton: false })
      : (callControls.participantsButton = false);
    return callControls;
  }
  if (callControls === true) {
    // Return object with just participant button to false so that the default is that all the buttons will be present for meeting composite.
    return { participantsButton: false };
  }
  // callControls === false
  return false;
};

/**
 * @private
 */
export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  const meetingStrings = useMeetingCompositeStrings();
  // Set the desired control buttons from the meetings composite. particiapantsButton is always false since there is the peopleButton.
  const meetingCallControlOptions = inferMeetingCallControlOptions(props.callControls);
  let callControlOptions = inferCallControlOptions(props.callControls);

  /**
   * Helper function to determine if a meeting control bar button is enabled or not.
   * @private
   */
  const isEnabled = (option: boolean | undefined): boolean => !(option === false);

  // Reduce the controls shown when mobile view is enabled.
  if (props.mobileView) {
    callControlOptions = reduceCallControlsForMobile(callControlOptions);
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
          <CallControls options={callControlOptions} increaseFlyoutItemSize={props.mobileView} />
        </CallAdapterProvider>
      </Stack.Item>
      {meetingCallControlOptions !== false && (
        <Stack horizontal>
          {isEnabled(meetingCallControlOptions?.chatButton) !== false && (
            <ChatButton
              checked={props.chatButtonChecked}
              showLabel={true}
              onClick={props.onChatButtonClicked}
              data-ui-id="meeting-composite-chat-button"
              disabled={props.disableButtonsForLobbyPage}
              label={meetingStrings.chatButtonLabel}
            />
          )}
          {isEnabled(meetingCallControlOptions?.peopleButton) !== false && (
            <PeopleButton
              checked={props.peopleButtonChecked}
              showLabel={true}
              onClick={props.onPeopleButtonClicked}
              data-ui-id="meeting-composite-people-button"
              disabled={props.disableButtonsForLobbyPage}
              label={meetingStrings.peopleButtonLabel}
            />
          )}
        </Stack>
      )}
    </Stack>
  );
};
