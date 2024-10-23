// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useCallback } from 'react';
import { useMemo } from 'react';
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton, DefaultButton, PrimaryButton } from '@fluentui/react';
import { _captionsOptions } from './StartCaptionsButton';
import { _preventDismissOnEvent } from '@internal/acs-ui-common';
import {
  buttonsContainerClassName,
  buttonStyles,
  themedCaptionsSettingsModalStyle,
  titleClassName,
  titleContainerClassName
} from './styles/CaptionsSettingsModal.styles';
import { useLocale } from '../localization';

/**
 * @beta
 * strings for rtt modal
 */
export interface RTTModalStrings {
  rttModalTitle?: string;
  rttModalText?: string;
  rttConfirmButtonLabel?: string;
  rttCancelButtonLabel?: string;
  rttModalAriaLabel?: string;
  rttCloseModalButtonAriaLabel?: string;
}

/**
 * @beta
 * RTTModal Component Props.
 */
export interface RTTModalProps {
  strings?: RTTModalStrings;
  showModal?: boolean;
  onDismissModal?: () => void;
  onStartRTT?: () => Promise<void>;
}

/**
 * @beta
 * a component for rtt modal
 */
export const RTTModal = (props: RTTModalProps): JSX.Element => {
  const { showModal, onDismissModal, onStartRTT } = props;
  const localeStrings = useLocale().strings.rttModal;
  const strings = { ...localeStrings, ...props.strings };

  const theme = useTheme();

  const onDismiss = useCallback((): void => {
    if (onDismissModal) {
      onDismissModal();
    }
  }, [onDismissModal]);

  const onConfirm = useCallback(async (): Promise<void> => {
    if (onStartRTT) {
      await onStartRTT();
    }
    onDismiss();
  }, [onDismiss, onStartRTT]);

  const RTTModalStyle: Partial<IModalStyles> = useMemo(() => themedCaptionsSettingsModalStyle(theme), [theme]);

  return (
    <>
      {
        <Modal
          titleAriaId={strings?.rttModalAriaLabel}
          isOpen={showModal}
          onDismiss={onDismiss}
          isBlocking={true}
          styles={RTTModalStyle}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
            <Text className={titleClassName}>{strings?.rttModalTitle}</Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings?.rttCloseModalButtonAriaLabel}
              onClick={onDismiss}
              style={{ color: theme.palette.black }}
            />
          </Stack>
          <Text>{strings?.rttModalText}</Text>

          <Stack horizontal horizontalAlign="end" className={buttonsContainerClassName}>
            <PrimaryButton styles={buttonStyles(theme)} onClick={onConfirm}>
              <span>{strings?.rttConfirmButtonLabel}</span>
            </PrimaryButton>
            <DefaultButton onClick={onDismiss} styles={buttonStyles(theme)}>
              <span>{strings?.rttCancelButtonLabel}</span>
            </DefaultButton>
          </Stack>
        </Modal>
      }
    </>
  );
};
