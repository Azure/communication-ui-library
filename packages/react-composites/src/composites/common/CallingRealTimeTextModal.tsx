// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import React from 'react';
/* @conditional-compile-remove(rtt) */
import { RealTimeTextModal, RealTimeTextModalStrings } from '@internal/react-components';
/* @conditional-compile-remove(rtt) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(rtt) */
/** @private */
export const CallingRealTimeTextModal = (props: {
  /** The flag to show the modal */
  showModal?: boolean;
  /** The function to dismiss the modal */
  onDismissModal?: () => void;
  /** The function to start RealTimeText */
  onStartRealTimeText?: () => void;
}): JSX.Element => {
  const strings = useLocale().strings.call;
  const modalStrings: RealTimeTextModalStrings = {
    realTimeTextModalTitle: strings.realTimeTextModalTitle,
    realTimeTextModalText: strings.realTimeTextModalText,
    realTimeTextConfirmButtonLabel: strings.realTimeTextConfirmButtonLabel,
    realTimeTextCancelButtonLabel: strings.realTimeTextCancelButtonLabel,
    realTimeTextModalAriaLabel: strings.realTimeTextModalAriaLabel,
    realTimeTextCloseModalButtonAriaLabel: strings.realTimeTextCloseModalButtonAriaLabel
  };

  return (
    <RealTimeTextModal
      strings={modalStrings}
      showModal={props.showModal}
      onDismissModal={props.onDismissModal}
      onStartRealTimeText={props.onStartRealTimeText}
    />
  );
};

export {};
