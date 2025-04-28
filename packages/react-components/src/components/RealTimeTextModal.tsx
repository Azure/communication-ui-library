// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import React, { useCallback } from 'react';
/* @conditional-compile-remove(rtt) */
import { useMemo } from 'react';
/* @conditional-compile-remove(rtt) */
import { IModalStyles, Modal, Stack, useTheme, Text, IconButton, DefaultButton, PrimaryButton } from '@fluentui/react';
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
 * @public
 * strings for realTimeText modal
 */
export interface RealTimeTextModalStrings {
  /** The title of the RealTimeText modal */
  realTimeTextModalTitle?: string;
  /** The text of the RealTimeText modal */
  realTimeTextModalText?: string;
  /** The label for the confirm button */
  realTimeTextConfirmButtonLabel?: string;
  /** The label for the cancel button */
  realTimeTextCancelButtonLabel?: string;
  /** The aria label for the modal */
  realTimeTextModalAriaLabel?: string;
  /** The aria label for the close button */
  realTimeTextCloseModalButtonAriaLabel?: string;
}
/* @conditional-compile-remove(rtt) */
/**
 * @public
 * RealTimeTextModal Component Props.
 */
export interface RealTimeTextModalProps {
  /** The strings for the RealTimeText modal */
  strings?: RealTimeTextModalStrings;
  /** The flag to show the modal */
  showModal?: boolean;
  /** The function to dismiss the modal */
  onDismissModal?: () => void;
  /**
   * Use this function to show RealTimeText UI in the calling experience.
   * Note that real time text should not be started for everyone in the call until the first real time text is received.
   */
  onStartRealTimeText?: () => void;
}
/* @conditional-compile-remove(rtt) */
/**
 * @public
 * a component for realTimeText modal
 */
export const RealTimeTextModal = (props: RealTimeTextModalProps): JSX.Element => {
  const { showModal, onDismissModal, onStartRealTimeText } = props;
  const localeStrings = useLocale().strings.realTimeTextModal;
  const strings = { ...localeStrings, ...props.strings };

  const theme = useTheme();

  const onDismiss = useCallback((): void => {
    if (onDismissModal) {
      onDismissModal();
    }
  }, [onDismissModal]);

  const onConfirm = useCallback(async (): Promise<void> => {
    if (onStartRealTimeText) {
      await onStartRealTimeText();
    }
    onDismiss();
  }, [onDismiss, onStartRealTimeText]);

  const RealTimeTextModalStyle: Partial<IModalStyles> = useMemo(() => themedCaptionsSettingsModalStyle(theme), [theme]);

  return (
    <>
      {
        <Modal
          titleAriaId={strings?.realTimeTextModalAriaLabel}
          isOpen={showModal}
          onDismiss={onDismiss}
          isBlocking={true}
          styles={RealTimeTextModalStyle}
        >
          <Stack horizontal horizontalAlign="space-between" verticalAlign="center" className={titleContainerClassName}>
            <Text role="heading" className={titleClassName} aria-level={1}>
              {strings?.realTimeTextModalTitle}
            </Text>
            <IconButton
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel={strings?.realTimeTextCloseModalButtonAriaLabel}
              onClick={onDismiss}
              style={{ color: theme.palette.black }}
            />
          </Stack>
          <Text>{strings?.realTimeTextModalText}</Text>

          <Stack horizontal horizontalAlign="end" className={buttonsContainerClassName}>
            <PrimaryButton
              styles={buttonStyles(theme)}
              onClick={onConfirm}
              data-ui-id="realTimeText-modal-confirm-button"
            >
              <span>{strings?.realTimeTextConfirmButtonLabel}</span>
            </PrimaryButton>
            <DefaultButton onClick={onDismiss} styles={buttonStyles(theme)}>
              <span>{strings?.realTimeTextCancelButtonLabel}</span>
            </DefaultButton>
          </Stack>
        </Modal>
      }
    </>
  );
};
