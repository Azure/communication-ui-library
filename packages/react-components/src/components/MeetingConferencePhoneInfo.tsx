// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton, Icon } from '@fluentui/react';

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
import { _preventDismissOnEvent } from '@internal/acs-ui-common';
import { useLocale } from '../localization';
import { _pxToRem } from '@internal/acs-ui-common';
import { _formatPhoneNumber } from './utils/formatPhoneNumber';

/**
 * strings for phone info modal
 * @public
 */
export interface MeetingConferencePhoneInfoModalStrings {
  /**
   * Header for the phone info modal
   */
  meetingConferencePhoneInfoModalTitle: string;
  /**
   * Phone number instruction
   */
  meetingConferencePhoneInfoModalDialIn: string;
  /**
   * Meeting ID instruction
   */
  meetingConferencePhoneInfoModalMeetingId: string;
  /**
   * Wait for phone connection
   */
  meetingConferencePhoneInfoModalWait: string;
  /**
   * Toll Free Phone Label
   */
  meetingConferencePhoneInfoModalTollFree: string;
  /**
   * Toll Phone Label
   */
  meetingConferencePhoneInfoModalToll: string;
  /**
   * Toll Phone Label without geo data
   */
  meetingConferencePhoneInfoModalTollGeoData: string;
  /**
   * No phone number available message
   */
  meetingConferencePhoneInfoModalNoPhoneAvailable: string;
}

/**
 * @public
 * MeetingConferencePhoneInfoModal Component Props.
 */
export interface MeetingConferencePhoneInfoModalProps {
  conferencePhoneInfoList: ConferencePhoneInfo[];
  showModal?: boolean;
  onDismissMeetingPhoneInfoSettings?: () => void;
}

/**
 * @public
 * a component for setting spoken languages
 */
export const MeetingConferencePhoneInfoModal = (props: MeetingConferencePhoneInfoModalProps): JSX.Element => {
  const { conferencePhoneInfoList, showModal, onDismissMeetingPhoneInfoSettings } = props;

  const theme = useTheme();
  const strings = useLocale().strings.meetingConferencePhoneInfo;

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
                      <Icon iconName="JoinByPhoneDialStepIcon" className={phoneInfoIconStyle(theme)} />
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
                      {_formatPhoneNumber(phoneNumber.phoneNumber, true)}{' '}
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
                      <Icon iconName="JoinByPhoneConferenceIdIcon" className={phoneInfoIconStyle(theme)} />
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
                  <Icon iconName="JoinByPhoneWaitToBeAdmittedIcon" className={phoneInfoIconStyle(theme)} />
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

/**
 * @internal
 * format phone number link
 */
export const formatPhoneNumberLink = (phoneNumber: ConferencePhoneInfo): string => {
  return `tel:+${phoneNumber.phoneNumber},,${phoneNumber.conferenceId}#`;
};

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
      ?.replace('{country}', phoneNumber.country || '')
      .replace('{city}', phoneNumber.city || '')
      .trim() || ''
  );
};

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
