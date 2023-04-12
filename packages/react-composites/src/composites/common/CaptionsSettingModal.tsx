// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(close-captions) */
import {
  _CaptionsSettingModal,
  _CaptionsSettingModalStrings,
  _CaptionsAvailableLanguageStrings
} from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(close-captions) */
import { _changeSpokenLanguageSelector } from '@internal/calling-component-bindings';

/** @private */
export const CaptionsSettingModal = (props: {
  /* @conditional-compile-remove(close-captions) */ showCaptionsSettingModal: boolean;
  /* @conditional-compile-remove(close-captions) */ onDismissCaptionsSetting: () => void;
}): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const captionsSettingModalProps = useAdaptedSelector(_changeSpokenLanguageSelector);
  /* @conditional-compile-remove(close-captions) */
  const handlers = useHandlers(_CaptionsSettingModal);
  /* @conditional-compile-remove(close-captions) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(close-captions) */
  const modalStrings: _CaptionsSettingModalStrings = {
    captionsSettingModalTitle: strings.captionsSettingModalTitle,
    captionsSettingDropdownLabel: strings.captionsSettingDropdownLabel,
    captionsSettingDropdownInfoText: strings.captionsSettingDropdownInfoText,
    captionsSettingConfirmButtonLabel: strings.captionsSettingConfirmButtonLabel,
    captionsSettingCancelButtonLabel: strings.captionsSettingCancelButtonLabel,
    captionsSettingModalAriaLabel: strings.captionsSettingModalAriaLabel,
    captionsSettingCloseModalButtonAriaLabel: strings.captionsSettingCloseModalButtonAriaLabel
  };
  /* @conditional-compile-remove(close-captions) */
  const captionsAvailableLanguageStrings: _CaptionsAvailableLanguageStrings = strings.captionsAvailableLanguageStrings;

  /* @conditional-compile-remove(close-captions) */
  return (
    <_CaptionsSettingModal
      {...captionsSettingModalProps}
      {...handlers}
      strings={modalStrings}
      captionsAvailableLanguageStrings={captionsAvailableLanguageStrings}
      showModal={props.showCaptionsSettingModal}
      onDismissCaptionsSetting={props.onDismissCaptionsSetting}
    />
  );
  return <></>;
};
