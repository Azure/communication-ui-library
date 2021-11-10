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

/**
 * @private
 */
export interface MeetingCallControlBarProps {
  callAdapter: CallAdapter;
  chatButtonChecked: boolean;
  peopleButtonChecked: boolean;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  mobileView?: boolean;
  disableButtonsForLobbyPage: boolean;
}

/**
 * @private
 */
export const MeetingCallControlBar = (props: MeetingCallControlBarProps): JSX.Element => {
  // Disable the default participants button as meetings composite has its own participants button.
  let callControlsOptions: CallControlOptions | false = {
    participantsButton: false,
    screenShareButton: props.mobileView ? false : { disabled: props.disableButtonsForLobbyPage }
  };

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
    <Stack horizontal className={mergeStyles(temporaryMeetingControlBarStyles, controlBarContainerStyles)}>
      <Stack.Item grow>
        <CallAdapterProvider adapter={props.callAdapter}>
          <CallControls options={callControlsOptions} increaseFlyoutItemSize={props.mobileView} />
        </CallAdapterProvider>
      </Stack.Item>
      <Stack.Item>
        <ChatButton
          checked={props.chatButtonChecked}
          showLabel={true}
          onClick={props.onChatButtonClicked}
          data-ui-id="meeting-composite-chat-button"
          disabled={props.disableButtonsForLobbyPage}
        />
        <PeopleButton
          checked={props.peopleButtonChecked}
          showLabel={true}
          onClick={props.onPeopleButtonClicked}
          data-ui-id="meeting-composite-people-button"
          disabled={props.disableButtonsForLobbyPage}
        />
      </Stack.Item>
    </Stack>
  );
};
