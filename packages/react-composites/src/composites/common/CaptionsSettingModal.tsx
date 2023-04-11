// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(close-captions) */
import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsSettingModal, _CaptionsSettingModalStrings } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(close-captions) */
import { _changeSpokenLanguageSelector } from '@internal/calling-component-bindings';

/* @conditional-compile-remove(close-captions) */
/** @private */
export const CaptionsSettingModal = (props: {
  showCaptionsSettingModal: boolean;
  onDismissCaptionsSetting: () => void;
}): JSX.Element => {
  const captionsSettingModalProps = useAdaptedSelector(_changeSpokenLanguageSelector);
  const handlers = useHandlers(_CaptionsSettingModal);
  const strings = useLocale().strings.call;
  const modalStrings: _CaptionsSettingModalStrings = {
    captionsSettingModalTitle: strings.captionsSettingModalTitle,
    captionsSettingDropdownLabel: strings.captionsSettingDropdownLabel,
    captionsSettingDropdownInfoText: strings.captionsSettingDropdownInfoText,
    captionsSettingConfirmButtonLabel: strings.captionsSettingConfirmButtonLabel,
    captionsSettingCancelButtonLabel: strings.captionsSettingCancelButtonLabel,
    captionsSettingModalAriaLabel: strings.captionsSettingModalAriaLabel,
    captionsSettingCloseModalButtonAriaLabel: strings.captionsSettingCloseModalButtonAriaLabel
  };

  return (
    <_CaptionsSettingModal
      {...captionsSettingModalProps}
      {...handlers}
      strings={modalStrings}
      showModal={props.showCaptionsSettingModal}
      onDismissCaptionsSetting={props.onDismissCaptionsSetting}
    />
  );
};

// This is a placeholder to bypass CC of "close-captions", remove when move the feature to stable
export {};
