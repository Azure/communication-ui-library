// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import React from 'react';
/* @conditional-compile-remove(teams-meeting-conference) */
import {
  _MeetingConferencePhoneInfoModal,
  _MeetingConferencePhoneInfoModalStrings,
  _ConferencePhoneInfo
} from '@internal/react-components';
/* @conditional-compile-remove(teams-meeting-conference) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(teams-meeting-conference) */
import { TeamsMeetingAudioConferencingDetails } from '@azure/communication-calling';

/* @conditional-compile-remove(teams-meeting-conference) */
/** @private */
export const MeetingConferencePhoneInfoModal = (props: {
  conferencePhoneInfoList: _ConferencePhoneInfo[];
  showMeetingConferencePhoneInfoModal: boolean;
  onDismissMeetingPhoneInfoSettings: () => void;
}): JSX.Element => {
  const strings = useLocale().strings.call;
  const modalStrings: _MeetingConferencePhoneInfoModalStrings = {
    meetingConferencePhoneInfoModalTitle: strings.meetingConferencePhoneInfoModalTitle,
    meetingConferencePhoneInfoModalDialIn: strings.meetingConferencePhoneInfoModalDialIn,
    meetingConferencePhoneInfoModalMeetingId: strings.meetingConferencePhoneInfoModalMeetingId,
    meetingConferencePhoneInfoModalWait: strings.meetingConferencePhoneInfoModalWait,
    meetingConferencePhoneInfoModalTollFree: strings.meetingConferencePhoneInfoModalTollFree,
    meetingConferencePhoneInfoModalToll: strings.meetingConferencePhoneInfoModalToll,
    meetingConferencePhoneInfoModalNoPhoneAvailable: strings.meetingConferencePhoneInfoModalNoPhoneAvailable
  };

  return (
    <_MeetingConferencePhoneInfoModal
      conferencePhoneInfoList={props.conferencePhoneInfoList}
      strings={modalStrings}
      showModal={props.showMeetingConferencePhoneInfoModal}
      onDismissMeetingPhoneInfoSettings={props.onDismissMeetingPhoneInfoSettings}
    />
  );
};

/* @conditional-compile-remove(teams-meeting-conference) */
/** @private */
export const convertConferencePhoneInfo = (
  meetingConferencePhoneInfo?: TeamsMeetingAudioConferencingDetails
): _ConferencePhoneInfo[] => {
  if (!meetingConferencePhoneInfo) {
    return [];
  }

  const convertedPhoneInfo = [];

  for (let i = 0; i < meetingConferencePhoneInfo.phoneNumbers.length; i++) {
    const phoneNumber = meetingConferencePhoneInfo.phoneNumbers[i];
    if (phoneNumber.tollPhoneNumber) {
      convertedPhoneInfo.push({
        phoneNumber: phoneNumber.tollPhoneNumber.phoneNumber,
        conferenceId: meetingConferencePhoneInfo.phoneConferenceId,
        isTollFree: false,
        country: phoneNumber.countryName,
        city: phoneNumber.cityName
      });
    }
    if (phoneNumber.tollFreePhoneNumber) {
      convertedPhoneInfo.push({
        phoneNumber: phoneNumber.tollFreePhoneNumber.phoneNumber,
        conferenceId: meetingConferencePhoneInfo.phoneConferenceId,
        isTollFree: true,
        country: phoneNumber.countryName,
        city: phoneNumber.cityName
      });
    }
  }
  return convertedPhoneInfo;
};
