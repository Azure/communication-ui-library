// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import React from 'react';
import { RealTimeTextModal, RealTimeTextModalStrings } from '@internal/react-components';
import { useLocale } from '../localization';
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
