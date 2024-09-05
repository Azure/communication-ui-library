// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(teams-meeting-conference) */
// eslint-disable-next-line no-restricted-imports
import { Stack, Text, useTheme, Icon, Link } from '@fluentui/react';
/* @conditional-compile-remove(teams-meeting-conference) */
import { _DrawerMenuItemProps } from '@internal/react-components';
/* @conditional-compile-remove(teams-meeting-conference) */
import React from 'react';
/* @conditional-compile-remove(teams-meeting-conference) */
import {
  ConferencePhoneInfo,
  formatPhoneNumberInfo,
  _formatPhoneNumber,
  formatPhoneNumberLink
} from '@internal/react-components';
/* @conditional-compile-remove(teams-meeting-conference) */
import {
  phoneInfoTextStyle,
  phoneInfoIcon,
  phoneInfoInstructionLine,
  phoneInfoStep,
  phoneInfoIconStyle,
  phoneInfoLabelStyle,
  phoneInfoContainerTokens,
  phoneInfoContainerStyle
} from './styles/TeamsMeetingConferenceInfo.style';
/* @conditional-compile-remove(teams-meeting-conference) */
import { useLocale } from '../localization';

/* @conditional-compile-remove(teams-meeting-conference) */
/**
 * @private
 */
export const MeetingPhoneInfoPaneContent = (props: {
  mobileView?: boolean;
  conferencePhoneInfoList?: ConferencePhoneInfo[];
}): JSX.Element => {
  const { conferencePhoneInfoList } = props;
  const theme = useTheme();
  const localeStrings = useLocale().component.strings.meetingConferencePhoneInfo;

  if (props.mobileView) {
    return (
      <Stack
        verticalFill
        styles={phoneInfoContainerStyle}
        tokens={phoneInfoContainerTokens}
        data-ui-id="phone-info-pane-content"
      >
        {(conferencePhoneInfoList === undefined || conferencePhoneInfoList.length === 0) && (
          <Stack horizontal>
            <Text className={phoneInfoTextStyle}>{localeStrings.meetingConferencePhoneInfoModalNoPhoneAvailable}</Text>
          </Stack>
        )}
        {conferencePhoneInfoList && conferencePhoneInfoList.length > 0 && (
          <Stack>
            <Stack horizontal horizontalAlign="space-between" className={phoneInfoInstructionLine}>
              <Stack.Item>
                <Stack horizontal className={phoneInfoStep}>
                  <Stack.Item className={phoneInfoIcon(theme)}>
                    <Stack verticalAlign="center" horizontalAlign="center">
                      <Icon iconName="JoinByPhoneDialStepIcon" className={phoneInfoIconStyle(theme)} />
                    </Stack>
                  </Stack.Item>
                  <Stack.Item>
                    <Text className={phoneInfoLabelStyle}>{localeStrings.meetingConferencePhoneInfoModalDialIn}</Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Stack.Item className={phoneInfoStep}>
                {conferencePhoneInfoList.map((phoneNumber, index) => (
                  <Stack.Item key={index}>
                    <Link className={phoneInfoTextStyle} href={formatPhoneNumberLink(phoneNumber)}>
                      {_formatPhoneNumber(phoneNumber.phoneNumber, true)}
                    </Link>
                    <Text className={phoneInfoTextStyle}>
                      {' '}
                      {phoneNumber.isTollFree
                        ? localeStrings.meetingConferencePhoneInfoModalTollFree
                        : localeStrings.meetingConferencePhoneInfoModalToll}
                    </Text>
                    <br />
                    <Text className={phoneInfoTextStyle}> {formatPhoneNumberInfo(phoneNumber, localeStrings)}</Text>
                  </Stack.Item>
                ))}
              </Stack.Item>
            </Stack>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              className={phoneInfoInstructionLine}
            >
              <Stack.Item>
                <Stack horizontal>
                  <Stack.Item className={phoneInfoIcon(theme)}>
                    <Icon iconName="JoinByPhoneConferenceIdIcon" className={phoneInfoIconStyle(theme)} />
                  </Stack.Item>
                  <Stack.Item>
                    <Text className={phoneInfoLabelStyle}>
                      {localeStrings.meetingConferencePhoneInfoModalMeetingId}
                    </Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Text className={phoneInfoTextStyle}>{conferencePhoneInfoList[0].conferenceId}#</Text>
            </Stack>
            <Stack
              horizontal
              horizontalAlign="space-between"
              verticalAlign="center"
              className={phoneInfoInstructionLine}
            >
              <Stack horizontal>
                <Stack.Item className={phoneInfoIcon(theme)}>
                  <Icon iconName="JoinByPhoneWaitToBeAdmittedIcon" className={phoneInfoIconStyle(theme)} />
                </Stack.Item>
                <Stack.Item>
                  <Text className={phoneInfoLabelStyle}>{localeStrings.meetingConferencePhoneInfoModalWait}</Text>
                </Stack.Item>
              </Stack>
            </Stack>
          </Stack>
        )}
      </Stack>
    );
  }

  return (
    <Stack
      verticalFill
      styles={phoneInfoContainerStyle}
      tokens={phoneInfoContainerTokens}
      data-ui-id="phone-info-pane-content"
    ></Stack>
  );
};
