// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { VideoGalleryStream, useTheme } from '@internal/react-components';
import { ExpandedLocalVideoTile } from './ExpandedLocalVideoTile';
import { mergeStyles, Stack, Text } from '@fluentui/react';
// eslint-disable-next-line no-restricted-imports
import { Icon } from '@fluentui/react';
import { useLocale } from '../../localization';
import {
  containerStyle,
  moreDetailsStyle,
  titleContainerStyle,
  titleStyle
} from '../styles/NetworkReconnectTile.styles';
import { useHandlers } from '../hooks/useHandlers';
import { CallCompositeIcon } from '../../common/icons';
import { getTeamsMeetingCoordinates, getIsTeamsMeeting } from '../selectors/baseSelectors';
import { useSelector } from '../hooks/useSelector';
import {
  phoneInfoTextStyle,
  phoneInfoIcon,
  phoneInfoInstructionLine,
  phoneInfoStep,
  phoneInfoIconStyle,
  phoneInfoLabelStyle,
  titleClassName,
  titleContainerClassName,
  infoConnectionLinkStyle
} from '../../common/styles/TeamsMeetingConferenceInfo.style';
import { formatPhoneNumberInfo, _formatPhoneNumber, formatPhoneNumberLink } from '@internal/react-components';
import { _pxToRem } from '@internal/acs-ui-common';
import { Link } from '@fluentui/react';

/**
 * @private
 */
export interface NetworkReconnectTileProps {
  localParticipantVideoStream: VideoGalleryStream;
  isMobile?: boolean;
}

/**
 * @private
 */
export const NetworkReconnectTile = (props: NetworkReconnectTileProps): JSX.Element => {
  const videoStream = props.localParticipantVideoStream;
  const isVideoReady = videoStream?.isAvailable ?? false;
  const palette = useTheme().palette;
  const strings = useLocale().strings.call;
  const localeStrings = useLocale().component.strings.meetingConferencePhoneInfo;
  const theme = useTheme();

  const handlers = useHandlers(ExpandedLocalVideoTile);

  const isTeamsMeeting = useSelector(getIsTeamsMeeting);
  const meetingCoordinates = useSelector(getTeamsMeetingCoordinates);

  return (
    <ExpandedLocalVideoTile
      localParticipantVideoStream={props.localParticipantVideoStream}
      overlayContent={
        <Stack
          verticalFill
          horizontalAlign="center"
          verticalAlign="center"
          className={mergeStyles(containerStyle)}
          aria-atomic
        >
          <Stack horizontal className={mergeStyles(titleContainerStyle)}>
            <CallCompositeIcon
              iconName="NetworkReconnectIcon"
              className={mergeStyles(titleStyle(palette, isVideoReady))}
            />
            <Text className={mergeStyles(titleStyle(palette, isVideoReady))} aria-live={'assertive'}>
              {strings.networkReconnectTitle}
            </Text>
          </Stack>
          <Text className={mergeStyles(moreDetailsStyle(palette, isVideoReady))} aria-live={'assertive'}>
            {strings.networkReconnectMoreDetails}
          </Text>
          {isTeamsMeeting && meetingCoordinates && meetingCoordinates[0] && (
            <Stack>
              <Stack horizontal horizontalAlign="center" verticalAlign="center" className={titleContainerClassName}>
                <Text className={titleClassName}>{localeStrings.meetingConferencePhoneInfoModalTitle}</Text>
              </Stack>
              <Stack horizontal horizontalAlign="space-between" className={phoneInfoInstructionLine}>
                <Stack className={infoConnectionLinkStyle(theme)}></Stack>
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
                  {meetingCoordinates.map((phoneNumber, index) => (
                    <Stack.Item key={index}>
                      <Text className={phoneInfoTextStyle}>
                        {props.isMobile && (
                          <Link className={phoneInfoTextStyle} href={formatPhoneNumberLink(phoneNumber)}>
                            {_formatPhoneNumber(phoneNumber.phoneNumber, true)}
                          </Link>
                        )}
                        {!props.isMobile && (
                          <Text className={phoneInfoTextStyle}>
                            {_formatPhoneNumber(phoneNumber.phoneNumber, true)}
                          </Text>
                        )}{' '}
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
                    {!props.isMobile && <Stack className={infoConnectionLinkStyle(theme)}></Stack>}
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
                <Text className={phoneInfoTextStyle}>{meetingCoordinates[0].conferenceId}#</Text>
              </Stack>
              {!props.isMobile && (
                <Stack
                  horizontal
                  horizontalAlign="space-between"
                  verticalAlign="center"
                  className={phoneInfoInstructionLine}
                >
                  <Stack horizontal>
                    <Stack.Item className={phoneInfoIcon(theme)} style={{ marginLeft: _pxToRem(2) }}>
                      <Icon iconName="JoinByPhoneWaitToBeAdmittedIcon" className={phoneInfoIconStyle(theme)} />
                    </Stack.Item>
                    <Stack.Item>
                      <Text className={phoneInfoLabelStyle}>{localeStrings.meetingConferencePhoneInfoModalWait}</Text>
                    </Stack.Item>
                  </Stack>
                </Stack>
              )}
            </Stack>
          )}
        </Stack>
      }
      {...handlers}
    />
  );
};
