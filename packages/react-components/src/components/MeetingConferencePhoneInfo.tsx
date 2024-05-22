// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton, Icon } from '@fluentui/react';

import {
  themedPhoneInfoModalStyle,
  titleClassName,
  titleContainerClassName,
  dropdownInfoTextStyle,
  phoneInfoIcon,
  phoneInfoInctructionLine,
  phoneInfoStep
} from './styles/TeamsMeetingConferenceInfo';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';

/**
 * @internal
 * Information for conference phone info
 */
export interface _ConferencePhoneInfo {
  phoneNumber: string;
  conferenceId: string;
  isTollFree: boolean;
  country?: string;
  city?: string;
}

/**
 * @internal
 * strings for captions setting modal
 */
export interface _MeetingConferencePhoneInfoModalStrings {
  meetingConferencePhoneInfoModalTitle?: string;
  meetingConferencePhoneInfoModalDialIn?: string;
  meetingConferencePhoneInfoModalMeetingId?: string;
  meetingConferencePhoneInfoModalWait?: string;
  meetingConferencePhoneInfoModalTollFree?: string;
  meetingConferencePhoneInfoModalToll?: string;
  meetingConferencePhoneInfoModalNoPhoneAvailable?: string;
}

/**
 * @internal
 * _CaptionsSettingsModal Component Props.
 */
export interface _MeetingConferencePhoneInfoModalProps {
  conferencePhoneInfoList: _ConferencePhoneInfo[];
  showModal?: boolean;
  strings?: _MeetingConferencePhoneInfoModalStrings;
  onDismissMeetingPhoneInfoSettings?: () => void;
}

/**
 * @internal
 * a component for setting spoken languages
 */
export const _MeetingConferencePhoneInfoModal = (props: _MeetingConferencePhoneInfoModalProps): JSX.Element => {
  const { conferencePhoneInfoList, showModal, strings, onDismissMeetingPhoneInfoSettings } = props;

  const theme = useTheme();

  const onDismiss = useCallback((): void => {
    if (onDismissMeetingPhoneInfoSettings) {
      onDismissMeetingPhoneInfoSettings();
    }
  }, [onDismissMeetingPhoneInfoSettings]);

  const PhoneInfoModalStyle: Partial<IModalStyles> = useMemo(() => themedPhoneInfoModalStyle(theme), [theme]);

  return (
    <>
      {
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
              <Text className={dropdownInfoTextStyle}>{strings?.meetingConferencePhoneInfoModalNoPhoneAvailable}</Text>
            </Stack>
          )}
          {conferencePhoneInfoList.length > 0 && (
            <Stack>
              <Stack horizontal horizontalAlign="space-between" className={phoneInfoInctructionLine}>
                <Stack.Item>
                  <Stack horizontal className={phoneInfoStep}>
                    <Stack.Item className={phoneInfoIcon}>
                      <Stack verticalAlign="center" horizontalAlign="center">
                        <Icon
                          iconName="PhoneNumberButton"
                          style={{ color: theme.palette.themePrimary, padding: '8px' }}
                        />
                      </Stack>
                    </Stack.Item>
                    <Stack.Item>
                      <Text className={dropdownInfoTextStyle}>{strings?.meetingConferencePhoneInfoModalDialIn}</Text>
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Stack.Item className={phoneInfoStep}>
                  {conferencePhoneInfoList.map((phoneNumber, index) => (
                    <Stack.Item key={index}>
                      <Text className={dropdownInfoTextStyle}>{formatPhoneNumberInfo(phoneNumber, strings)}</Text>
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
                {}
                <Stack.Item>
                  <Stack horizontal>
                    <Stack.Item className={phoneInfoIcon}>
                      <Icon
                        iconName="DtmfDialpadButton"
                        style={{ color: theme.palette.themePrimary, padding: '8px' }}
                      />
                    </Stack.Item>
                    <Stack.Item>
                      <Text className={dropdownInfoTextStyle}>{strings?.meetingConferencePhoneInfoModalMeetingId}</Text>
                    </Stack.Item>
                  </Stack>
                </Stack.Item>
                <Text className={dropdownInfoTextStyle}>{conferencePhoneInfoList[0].conferenceId}#</Text>
              </Stack>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Stack horizontal>
                  <Stack.Item className={phoneInfoIcon}>
                    <Icon iconName="PhoneInfoWait" style={{ color: theme.palette.themePrimary, padding: '8px' }} />
                  </Stack.Item>
                  <Stack.Item>
                    <Text className={dropdownInfoTextStyle}>{strings?.meetingConferencePhoneInfoModalWait}</Text>
                  </Stack.Item>
                </Stack>
              </Stack>
            </Stack>
          )}
        </Modal>
      }
    </>
  );
};

/**
 * @internal
 * format phone number
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1,2})?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = '+' + match[1] + ' ';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return phoneNumber;
};

/**
 * @internal
 * format phone number
 */
export const formatPhoneNumberInfo = (
  phoneNumber: _ConferencePhoneInfo | undefined,
  strings: _MeetingConferencePhoneInfoModalStrings | undefined
): string => {
  if (!phoneNumber) {
    return '';
  }
  const toll = phoneNumber.isTollFree
    ? strings?.meetingConferencePhoneInfoModalTollFree
    : strings?.meetingConferencePhoneInfoModalToll;
  const countryAndCity = [phoneNumber.country, phoneNumber.city].filter((x) => x).join(', ');
  return [formatPhoneNumber(phoneNumber.phoneNumber), toll, countryAndCity].filter((x) => x).join(' ');
};
