// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import React, { useCallback } from 'react';
/* @conditional-compile-remove(rtt) */
import { useMemo } from 'react';
/* @conditional-compile-remove(rtt) */
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton, DefaultButton, PrimaryButton } from '@fluentui/react';
/* @conditional-compile-remove(rtt) */
import { _captionsOptions } from './StartCaptionsButton';
/* @conditional-compile-remove(rtt) */
import { _preventDismissOnEvent } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rtt) */
import {
  buttonsContainerClassName,
  buttonStyles,
  themedCaptionsSettingsModalStyle,
  titleClassName,
  titleContainerClassName
} from './styles/CaptionsSettingsModal.styles';
/* @conditional-compile-remove(rtt) */
import { useLocale } from '../localization';

/* @conditional-compile-remove(rtt) */
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
/* @conditional-compile-remove(rtt) */
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
/* @conditional-compile-remove(rtt) */
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
