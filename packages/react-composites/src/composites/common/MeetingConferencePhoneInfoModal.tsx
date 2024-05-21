// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { _MeetingConferencePhoneInfoModal, _MeetingConferencePhoneInfoModalStrings } from '@internal/react-components';
import { useLocale } from '../localization';
import { _captionSettingsSelector } from '@internal/calling-component-bindings';

/** @private */
export const MeetingConferencePhoneInfoModal = (props: {
  showMeetingConferencePhoneInfoModal: boolean;
  onDismissMeetingPhoneInfoSettings: () => void;
}): JSX.Element => {
  const strings = useLocale().strings.call;
  const modalStrings: _MeetingConferencePhoneInfoModalStrings = {
    meetingConferencePhoneInfoModalTitle: strings.meetingConferencePhoneInfoModalTitle,
    meetingConferencePhoneInfoModalDialIn: strings.meetingConferencePhoneInfoModalDialIn,
    meetingConferencePhoneInfoModalMeetingId: strings.meetingConferencePhoneInfoModalMeetingId,
    meetingConferencePhoneInfoModalWait: strings.meetingConferencePhoneInfoModalWait
  };

  return (
    <_MeetingConferencePhoneInfoModal
      strings={modalStrings}
      showModal={props.showMeetingConferencePhoneInfoModal}
      onDismissMeetingPhoneInfoSettings={props.onDismissMeetingPhoneInfoSettings}
    />
  );
};
