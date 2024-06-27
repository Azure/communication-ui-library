// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
import React, { useCallback } from 'react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { useMemo } from 'react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton, Icon } from '@fluentui/react';

/* @conditional-compile-remove(teams-meeting-conference) */
import {
  themedPhoneInfoModalStyle,
  titleClassName,
  titleContainerClassName,
  phoneInfoTextStyle,
  phoneInfoIcon,
  phoneInfoInctructionLine,
  phoneInfoStep,
  stepTextStyle,
  infoConnectionLinkStyle,
  phoneInfoIconStyle
} from './styles/TeamsMeetingConferenceInfo';
/* @conditional-compile-remove(teams-meeting-conference) */
import { _preventDismissOnEvent } from '@internal/acs-ui-common';
/* @conditional-compile-remove(teams-meeting-conference) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(teams-meeting-conference) */
import { isPossiblePhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
/* @conditional-compile-remove(teams-meeting-conference) */
import { _pxToRem } from '@internal/acs-ui-common';

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * strings for phone info modal
 * @beta
 */
export interface MeetingConferencePhoneInfoModalStrings {
  /**
   * Header for the phone info modal
   */
  meetingConferencePhoneInfoModalTitle?: string;
  /**
   * Phone number instruction
   */
  meetingConferencePhoneInfoModalDialIn?: string;
  /**
   * Meeting ID instruction
   */
  meetingConferencePhoneInfoModalMeetingId?: string;
  /**
   * Wait for phone connection
   */
  meetingConferencePhoneInfoModalWait?: string;
  /**
   * Toll Free Phone Label
   */
  meetingConferencePhoneInfoModalTollFree?: string;
  /**
   * Toll Phone Label
   */
  meetingConferencePhoneInfoModalToll?: string;
  /**
   * Toll Phone Label without geo data
   */
  meetingConferencePhoneInfoModalTollGeoData?: string;
  /**
   * No phone number available message
   */
  meetingConferencePhoneInfoModalNoPhoneAvailable?: string;
}

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @beta
 * MeetingConferencePhoneInfoModal Component Props.
 */
export interface MeetingConferencePhoneInfoModalProps {
  conferencePhoneInfoList: ConferencePhoneInfo[];
  showModal?: boolean;
  onDismissMeetingPhoneInfoSettings?: () => void;
}

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @beta
 * a component for setting spoken languages
 */
export const MeetingConferencePhoneInfoModal = (props: MeetingConferencePhoneInfoModalProps): JSX.Element => {
  const { conferencePhoneInfoList, showModal, onDismissMeetingPhoneInfoSettings } = props;

  const theme = useTheme();
  const strings = useLocale().strings.MeetingConferencePhoneInfo;

  const onDismiss = useCallback((): void => {
    if (onDismissMeetingPhoneInfoSettings) {
      onDismissMeetingPhoneInfoSettings();
    }
  }, [onDismissMeetingPhoneInfoSettings]);

  const PhoneInfoModalStyle: Partial<IModalStyles> = useMemo(() => themedPhoneInfoModalStyle(theme), [theme]);

  return (
    <>
      <Modal
        titleAriaId={strings?.meetingConferencePhoneInfoModalTitle}
        isOpen={showModal}
        onDismiss={onDismiss}
        isBlocking={true}
        styles={PhoneInfoModalStyle}
      >
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
          <Text className={titleClassName}>{strings?.meetingConferencePhoneInfoModalTitle}</Text>
          <IconButton
            iconProps={{ iconName: 'Cancel' }}
            ariaLabel={strings?.meetingConferencePhoneInfoModalTitle}
            onClick={onDismiss}
            style={{ color: theme.palette.black }}
          />
        </Stack>
        {conferencePhoneInfoList.length === 0 && (
          <Stack horizontal>
            <Text className={stepTextStyle}>{strings?.meetingConferencePhoneInfoModalNoPhoneAvailable}</Text>
          </Stack>
        )}
        {conferencePhoneInfoList.length > 0 && (
          <Stack>
            <Stack horizontal horizontalAlign="space-between" className={phoneInfoInctructionLine}>
              <Stack.Item style={{ display: 'flex' }}>
                <Stack horizontal className={phoneInfoStep}>
                  <Stack className={infoConnectionLinkStyle(theme)}></Stack>
                  <Stack.Item className={phoneInfoIcon(theme)}>
                    <Stack verticalAlign="center" horizontalAlign="center">
                      <Icon iconName="PhoneNumberButton" className={phoneInfoIconStyle(theme)} />
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <Text className={stepTextStyle}>{strings?.meetingConferencePhoneInfoModalDialIn}</Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Stack.Item className={phoneInfoStep}>
                {conferencePhoneInfoList.map((phoneNumber, index) => (
                  <Stack.Item key={index}>
                    <Text className={phoneInfoTextStyle}>
                      {formatPhoneNumber(phoneNumber.phoneNumber)}{' '}
                      {phoneNumber.isTollFree
                        ? strings.meetingConferencePhoneInfoModalTollFree
                        : strings.meetingConferencePhoneInfoModalToll}
                    </Text>
                    <br />
                    <Text className={phoneInfoTextStyle}> {formatPhoneNumberInfo(phoneNumber, strings)}</Text>
                  </Stack.Item>
                ))}
              </Stack.Item>
            </Stack>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              className={phoneInfoInctructionLine}
            >
              <Stack.Item style={{ display: 'flex' }}>
                <Stack horizontal>
                  <Stack className={infoConnectionLinkStyle(theme)}></Stack>
                  <Stack.Item className={phoneInfoIcon(theme)}>
                    <Stack verticalAlign="center" horizontalAlign="center">
                      <Icon iconName="DtmfDialpadButton" className={phoneInfoIconStyle(theme)} />
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <Text className={stepTextStyle}>{strings?.meetingConferencePhoneInfoModalMeetingId}</Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Text className={phoneInfoTextStyle}>{formatMeetingId(conferencePhoneInfoList[0].conferenceId)}</Text>
            </Stack>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal>
                <Stack.Item className={phoneInfoIcon(theme)} style={{ marginLeft: _pxToRem(2) }}>
                  <Icon iconName="PhoneInfoWait" className={phoneInfoIconStyle(theme)} />
                </Stack.Item>
                <Stack.Item>
                  <Text className={stepTextStyle}>{strings?.meetingConferencePhoneInfoModalWait}</Text>
                </Stack.Item>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Modal>
    </>
  );
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @internal
 * format phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  if (!phoneNumber) {
    return '';
  }
  let enchantedPhoneNumber = phoneNumber;
  if (!phoneNumber.startsWith('+')) {
    enchantedPhoneNumber = `+${phoneNumber}`;
  }
  if (isPossiblePhoneNumber(enchantedPhoneNumber)) {
    return parsePhoneNumber(enchantedPhoneNumber)?.formatInternational() || enchantedPhoneNumber;
  }
  return phoneNumber;
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @internal
 * format phone number link
 */
export const formatPhoneNumberLink = (phoneNumber: ConferencePhoneInfo): string => {
  return `tel:+${phoneNumber.phoneNumber},,${phoneNumber.conferenceId}#`;
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @internal
 * format phone number
 */
export const formatPhoneNumberInfo = (
  phoneNumber: ConferencePhoneInfo,
  strings: MeetingConferencePhoneInfoModalStrings | undefined
): string => {
  const templateText =
    phoneNumber.country && phoneNumber.city ? strings?.meetingConferencePhoneInfoModalTollGeoData : '';
  return (
    templateText
      ?.replace('{phoneNumber}', formatPhoneNumber(phoneNumber.phoneNumber))
      .replace('{country}', phoneNumber.country || '')
      .replace('{city}', phoneNumber.city || '')
      .trim() || ''
  );
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @internal
 * format meeting id
 */
export const formatMeetingId = (meetingId?: string): string => {
  if (!meetingId) {
    return '';
  }
  if (meetingId?.length !== 9) {
    return meetingId;
  }

  return [meetingId.slice(0, 3), meetingId.slice(3, 6), meetingId.slice(6, 9)].join(' ') + '#';
};

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @public
 * Information for conference phone info
 */
export interface ConferencePhoneInfo {
  phoneNumber: string;
  conferenceId: string;
  isTollFree: boolean;
  country?: string;
  city?: string;
}
