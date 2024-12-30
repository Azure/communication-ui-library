// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(rtt) */
import React from 'react';
/* @conditional-compile-remove(rtt) */
import { RealTimeTextModal, RealTimeTextModalStrings, StartRealTimeTextButton } from '@internal/react-components';
/* @conditional-compile-remove(rtt) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(rtt) */
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';
/* @conditional-compile-remove(rtt) */
/** @private */
export const CallingRealTimeTextModal = (props: {
  /** The flag to show the modal */
  showModal?: boolean;
  /** The function to dismiss the modal */
  onDismissModal?: () => void;
  /** The function to start RealTimeText */
  onStartRealTimeText?: () => Promise<void>;
}): JSX.Element => {
  const startRealTimeTextProps = usePropsFor(StartRealTimeTextButton);
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
      onStartRealTimeText={() => {
        startRealTimeTextProps.onStartRealTimeText();
        props.onStartRealTimeText && props.onStartRealTimeText();
        return Promise.resolve();
      }}
    />
  );
};

export {};
