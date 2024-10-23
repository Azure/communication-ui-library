// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { useLocale } from '../localization';
import { _CaptionsSettingsModal, _CaptionsSettingsModalStrings } from '@internal/react-components';

/** @private */
export const RTTModal = (props: { showRTTModal: boolean; onDismiss: () => void }): JSX.Element => {
  // const RTTModalProps = useAdaptedSelector(_captionSettingsSelector);
  // const handlers = useHandlers(_RTTModal);
  const strings = useLocale().strings.call;
  const modalStrings: _CaptionsSettingsModalStrings = {
    captionsSettingsModalTitle: strings.rttModalTitle,
    captionsSettingsModalText: strings.rttModalText,
    captionsSettingsConfirmButtonLabel: strings.rttConfirmButtonLabel,
    captionsSettingsCancelButtonLabel: strings.captionsSettingsCancelButtonLabel,
    captionsSettingsModalAriaLabel: strings.rttModalAriaLabel,
    captionsSettingsCloseModalButtonAriaLabel: strings.rttCloseModalButtonAriaLabel
  };

  return (
    <_CaptionsSettingsModal
      strings={modalStrings}
      showModal={props.showRTTModal}
      onDismissModal={props.onDismiss}
      rttOrCaptions="RTT"
    />
  );
};
