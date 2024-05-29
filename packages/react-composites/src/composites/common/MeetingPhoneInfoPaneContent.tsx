// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Stack, Text, useTheme, Icon } from '@fluentui/react';
import { _DrawerMenuItemProps } from '@internal/react-components';
import React from 'react';
import { peoplePaneContainerTokens } from '../common/styles/ParticipantContainer.styles';
import { peoplePaneContainerStyle } from './styles/PeoplePaneContent.styles';
import {
  _ConferencePhoneInfo,
  _MeetingConferencePhoneInfoModalStrings,
  formatPhoneNumberInfo
} from '@internal/react-components';
import {
  phoneInfoTextStyle,
  phoneInfoIcon,
  phoneInfoInctructionLine,
  phoneInfoStep
} from './styles/TeamsMeetingConferenceInfo.style';
import { useLocale } from '../localization';

/**
 * @private
 */
export const MeetingPhoneInfoPaneContent = (props: {
  mobileView?: boolean;
  conferencePhoneInfoList?: _ConferencePhoneInfo[];
}): JSX.Element => {
  const { conferencePhoneInfoList } = props;
  const theme = useTheme();
  const localeStrings = useLocale();

  if (props.mobileView) {
    return (
      <Stack
        verticalFill
        styles={peoplePaneContainerStyle}
        tokens={peoplePaneContainerTokens}
        data-ui-id="phone-info-pane-content"
      >
        {(conferencePhoneInfoList === undefined || conferencePhoneInfoList.length === 0) && (
          <Stack horizontal>
            <Text className={phoneInfoTextStyle}>
              {localeStrings.strings.call.meetingConferencePhoneInfoModalNoPhoneAvailable}
            </Text>
          </Stack>
        )}
        {conferencePhoneInfoList && conferencePhoneInfoList.length > 0 && (
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
                    <Text className={phoneInfoTextStyle}>
                      {localeStrings.strings.call.meetingConferencePhoneInfoModalDialIn}
                    </Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Stack.Item className={phoneInfoStep}>
                {conferencePhoneInfoList.map((phoneNumber, index) => (
                  <Stack.Item key={index}>
                    <Text className={phoneInfoTextStyle}>
                      {formatPhoneNumberInfo(phoneNumber, localeStrings.strings.call)}
                    </Text>
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
                    <Icon iconName="DtmfDialpadButton" style={{ color: theme.palette.themePrimary, padding: '8px' }} />
                  </Stack.Item>
                  <Stack.Item>
                    <Text className={phoneInfoTextStyle}>
                      {localeStrings.strings.call.meetingConferencePhoneInfoModalMeetingId}
                    </Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Text className={phoneInfoTextStyle}>{conferencePhoneInfoList[0].conferenceId}#</Text>
            </Stack>
            <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
              <Stack horizontal>
                <Stack.Item className={phoneInfoIcon}>
                  <Icon iconName="PhoneInfoWait" style={{ color: theme.palette.themePrimary, padding: '8px' }} />
                </Stack.Item>
                <Stack.Item>
                  <Text className={phoneInfoTextStyle}>
                    {localeStrings.strings.call.meetingConferencePhoneInfoModalWait}
                  </Text>
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
      styles={peoplePaneContainerStyle}
      tokens={peoplePaneContainerTokens}
      data-ui-id="phone-info-pane-content"
    ></Stack>
  );
};
