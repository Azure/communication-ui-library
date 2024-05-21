// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton } from '@fluentui/react';

import {
  themedCaptionsSettingsModalStyle,
  titleClassName,
  titleContainerClassName
} from './styles/CaptionsSettingsModal.styles';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';

/**
 * @internal
 * strings for captions setting modal
 */
export interface _MeetingConferencePhoneInfoModalStrings {
  meetingConferencePhoneInfoModalTitle?: string;
  meetingConferencePhoneInfoModalDialIn?: string;
  meetingConferencePhoneInfoModalMeetingId?: string;
  meetingConferencePhoneInfoModalWait?: string;
}

/**
 * @internal
 * _CaptionsSettingsModal Component Props.
 */
export interface _MeetingConferencePhoneInfoModalProps {
  showModal?: boolean;
  strings?: _MeetingConferencePhoneInfoModalStrings;
  onDismissMeetingPhoneInfoSettings?: () => void;
}

/**
 * @internal
 * a component for setting spoken languages
 */
export const _MeetingConferencePhoneInfoModal = (props: _MeetingConferencePhoneInfoModalProps): JSX.Element => {
  const { showModal, strings, onDismissMeetingPhoneInfoSettings } = props;

  const theme = useTheme();

  const onDismiss = useCallback((): void => {
    if (onDismissMeetingPhoneInfoSettings) {
      onDismissMeetingPhoneInfoSettings();
    }
  }, [onDismissMeetingPhoneInfoSettings]);

  const CaptionsSettingsModalStyle: Partial<IModalStyles> = useMemo(
    () => themedCaptionsSettingsModalStyle(theme),
    [theme]
  );

  return (
    <>
      {
        <Modal
          titleAriaId={strings?.meetingConferencePhoneInfoModalTitle}
          isOpen={showModal}
          onDismiss={onDismiss}
          isBlocking={true}
          styles={CaptionsSettingsModalStyle}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
            <Text className={titleClassName}>{strings?.meetingConferencePhoneInfoModalTitle}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings?.meetingConferencePhoneInfoModalTitle}
              onClick={onDismiss}
              style={{ color: theme.palette.themePrimary }}
            />
          </Stack>
          <Stack>
            <IconButton
              iconProps={{ iconName: 'PhoneNumberButton' }}
              ariaLabel={strings?.meetingConferencePhoneInfoModalDialIn}
              style={{ color: theme.palette.black }}
            />
            <Text className={titleClassName}>{strings?.meetingConferencePhoneInfoModalDialIn}</Text>
          </Stack>
          <Stack>
            <IconButton
              iconProps={{ iconName: 'DtmfDialpadButton' }}
              ariaLabel={strings?.meetingConferencePhoneInfoModalMeetingId}
              style={{ color: theme.palette.themePrimary }}
            />
            <Text className={titleClassName}>{strings?.meetingConferencePhoneInfoModalMeetingId}</Text>
          </Stack>
          <Stack>
            <IconButton
              iconProps={{ iconName: 'PhoneInfoWait' }}
              ariaLabel={strings?.meetingConferencePhoneInfoModalWait}
              style={{ color: theme.palette.themePrimary }}
            />
            <Text className={titleClassName}>{strings?.meetingConferencePhoneInfoModalWait}</Text>
          </Stack>
        </Modal>
      }
    </>
  );
};
