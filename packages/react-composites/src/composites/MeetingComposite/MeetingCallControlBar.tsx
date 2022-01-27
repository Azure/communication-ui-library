// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import {
  CallControlOptions,
  CallControls,
  CustomCallControlButtonCallback,
  CustomCallControlButtonPlacement,
  CustomCallControlButtonProps
} from '../CallComposite/components/CallControls';
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
/* @conditional-compile-remove-from(stable): custom button injection */
import { ControlBarButton } from '@internal/react-components';

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

  /* @conditional-compile-remove-from(stable): custom button injection*/
  const isCustomButtonEnabled = (option: CustomCallControlButtonCallback[] | undefined): boolean =>
    !(option === undefined || option.length == 0);

  // Reduce the controls shown when mobile view is enabled.
  if (props.mobileView) {
    callControlOptions = reduceCallControlsForMobile(callControlOptions);
  }

  /**
   * Until mobile meetings is worked on, statically set the width of the
   * control bar such that all controls can be accessed.
   */
  const temporaryMeetingControlBarStyles = props.mobileView ? { width: '23.5rem' } : undefined;

  /* @conditional-compile-remove-from(stable): custom button injection*/
  const options = typeof props.callControls === 'boolean' ? {} : props.callControls;

  //TODO
  /* @conditional-compile-remove-from(stable): custom button injection */
  const customButtonProps = useMemo(() => {
    if (!options || !options.onFetchCustomButtonProps) {
      return [];
    }
    return options.onFetchCustomButtonProps.map((f) => f({ displayType: options.displayType }));
  }, [options?.onFetchCustomButtonProps, options?.displayType]);

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
        <Stack.Item>
          {isCustomButtonEnabled(options?.onFetchCustomButtonProps) !== false && (
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'desktop.controlBarEnd.first'} />
          )}
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
          {isCustomButtonEnabled(options?.onFetchCustomButtonProps) !== false && (
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons
              customButtonProps={customButtonProps}
              placement={'desktop.controlBarEnd.afterChatButton'}
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
          {isCustomButtonEnabled(options?.onFetchCustomButtonProps) !== false && (
            /* @conditional-compile-remove-from(stable): custom button injection */
            <FilteredCustomButtons customButtonProps={customButtonProps} placement={'desktop.controlBarEnd.last'} />
          )}
        </Stack.Item>
      )}
    </Stack>
  );
};

/* @conditional-compile-remove-from(stable): custom button injection */
const FilteredCustomButtons = (props: {
  customButtonProps: CustomCallControlButtonProps[];
  placement: CustomCallControlButtonPlacement;
}): JSX.Element => {
  return (
    <>
      {props.customButtonProps
        .filter((buttonProps) => buttonProps.placement === props.placement)
        .map((buttonProps, i) => (
          <ControlBarButton {...buttonProps} key={`${buttonProps.placement}_${i}`} />
        ))}
    </>
  );
};
