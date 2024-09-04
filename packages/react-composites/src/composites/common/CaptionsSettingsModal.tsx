// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import {
  _CaptionsSettingsModal,
  _CaptionsSettingsModalStrings,
  SpokenLanguageStrings,
  CaptionLanguageStrings
} from '@internal/react-components';
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { useLocale } from '../localization';
import { _captionSettingsSelector } from '@internal/calling-component-bindings';

/** @private */
export const CaptionsSettingsModal = (props: {
  showCaptionsSettingsModal: boolean;
  onDismissCaptionsSettings: () => void;
  changeCaptionLanguage?: boolean;
}): JSX.Element => {
  const CaptionsSettingsModalProps = useAdaptedSelector(_captionSettingsSelector);
  const handlers = useHandlers(_CaptionsSettingsModal);
  const strings = useLocale().strings.call;
  const modalStrings: _CaptionsSettingsModalStrings = {
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
    <_CaptionsSettingsModal
      {...CaptionsSettingsModalProps}
      {...handlers}
      strings={modalStrings}
      spokenLanguageStrings={spokenLanguageStrings}
      captionLanguageStrings={captionLanguageStrings}
      showModal={props.showCaptionsSettingsModal}
      onDismissCaptionsSettings={props.onDismissCaptionsSettings}
      changeCaptionLanguage={props.changeCaptionLanguage}
    />
  );
};
