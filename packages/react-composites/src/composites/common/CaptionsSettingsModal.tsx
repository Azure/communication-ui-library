// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(close-captions) */
import {
  _CaptionsSettingsModal,
  _CaptionsSettingsModalStrings,
  SpokenLanguageStrings,
  CaptionLanguageStrings
} from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(close-captions) */
import { _captionSettingsSelector } from '@internal/calling-component-bindings';

/** @private */
export const CaptionsSettingsModal = (props: {
  /* @conditional-compile-remove(close-captions) */ showCaptionsSettingsModal: boolean;
  /* @conditional-compile-remove(close-captions) */ onDismissCaptionsSettings: () => void;
  /* @conditional-compile-remove(close-captions) */ changeCaptionLanguage?: boolean;
}): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const CaptionsSettingsModalProps = useAdaptedSelector(_captionSettingsSelector);
  /* @conditional-compile-remove(close-captions) */
  const handlers = useHandlers(_CaptionsSettingsModal);
  /* @conditional-compile-remove(close-captions) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(close-captions) */
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
  /* @conditional-compile-remove(close-captions) */
  const spokenLanguageStrings: SpokenLanguageStrings | undefined = strings.spokenLanguageStrings;

  /* @conditional-compile-remove(close-captions) */
  const captionLanguageStrings: CaptionLanguageStrings | undefined = strings.captionLanguageStrings;

  /* @conditional-compile-remove(close-captions) */
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
  return <></>;
};
