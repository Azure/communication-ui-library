// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import {
  CaptionsSettingsModal,
  CaptionsSettingsModalStrings,
  SpokenLanguageStrings,
  CaptionLanguageStrings
} from '@internal/react-components';
import { useLocale } from '../localization';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';

/** @private */
export const CallingCaptionsSettingsModal = (props: {
  showCaptionsSettingsModal: boolean;
  onDismissCaptionsSettings: () => void;
  changeCaptionLanguage?: boolean;
}): JSX.Element => {
  const CaptionsSettingsModalProps = usePropsFor(CaptionsSettingsModal);
  const strings = useLocale().strings.call;
  const modalStrings: CaptionsSettingsModalStrings = {
    captionsSettingsModalTitle: strings.captionsSettingsModalTitle,
    captionsSettingsSpokenLanguageDropdownLabel: strings.captionsSettingsSpokenLanguageDropdownLabel,
    captionsSettingsCaptionLanguageDropdownLabel: strings.captionsSettingsCaptionLanguageDropdownLabel,
    captionsSettingsSpokenLanguageDropdownInfoText: strings.captionsSettingsSpokenLanguageDropdownInfoText,
    captionsSettingsCaptionLanguageDropdownInfoText: strings.captionsSettingsCaptionLanguageDropdownInfoText,
    captionsSettingsConfirmButtonLabel: strings.captionsSettingsConfirmButtonLabel,
    captionsSettingsCancelButtonLabel: strings.captionsSettingsCancelButtonLabel,
    captionsSettingsModalAriaLabel: strings.captionsSettingsModalAriaLabel,
    captionsSettingsCloseModalButtonAriaLabel: strings.captionsSettingsCloseModalButtonAriaLabel
  };

  const spokenLanguageStrings: SpokenLanguageStrings | undefined = strings.spokenLanguageStrings;

  const captionLanguageStrings: CaptionLanguageStrings | undefined = strings.captionLanguageStrings;

  return (
    <CaptionsSettingsModal
      {...CaptionsSettingsModalProps}
      strings={modalStrings}
      spokenLanguageStrings={spokenLanguageStrings}
      captionLanguageStrings={captionLanguageStrings}
      showModal={props.showCaptionsSettingsModal}
      onDismissCaptionsSettings={props.onDismissCaptionsSettings}
      changeCaptionLanguage={props.changeCaptionLanguage}
    />
  );
};
