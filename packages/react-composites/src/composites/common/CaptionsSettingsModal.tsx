// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
/* @conditional-compile-remove(close-captions) */
import { _CaptionsSettingsModal, _CaptionsSettingsModalStrings } from '@internal/react-components';
/* @conditional-compile-remove(close-captions) */
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
/* @conditional-compile-remove(close-captions) */
import { useHandlers } from '../CallComposite/hooks/useHandlers';
/* @conditional-compile-remove(close-captions) */
import { useLocale } from '../localization';
/* @conditional-compile-remove(close-captions) */
import { _changeSpokenLanguageSelector } from '@internal/calling-component-bindings';

/** @private */
export const CaptionsSettingsModal = (props: {
  /* @conditional-compile-remove(close-captions) */ showCaptionsSettingsModal: boolean;
  /* @conditional-compile-remove(close-captions) */ onDismissCaptionsSettings: () => void;
}): JSX.Element => {
  /* @conditional-compile-remove(close-captions) */
  const CaptionsSettingsModalProps = useAdaptedSelector(_changeSpokenLanguageSelector);
  /* @conditional-compile-remove(close-captions) */
  const handlers = useHandlers(_CaptionsSettingsModal);
  /* @conditional-compile-remove(close-captions) */
  const strings = useLocale().strings.call;
  /* @conditional-compile-remove(close-captions) */
  const modalStrings: _CaptionsSettingsModalStrings = {
    captionsSettingsModalTitle: strings.captionsSettingsModalTitle,
    captionsSettingsDropdownLabel: strings.captionsSettingsDropdownLabel,
    captionsSettingsDropdownInfoText: strings.captionsSettingsDropdownInfoText,
    captionsSettingsConfirmButtonLabel: strings.captionsSettingsConfirmButtonLabel,
    captionsSettingsCancelButtonLabel: strings.captionsSettingsCancelButtonLabel,
    captionsSettingsModalAriaLabel: strings.captionsSettingsModalAriaLabel,
    captionsSettingsCloseModalButtonAriaLabel: strings.captionsSettingsCloseModalButtonAriaLabel
  };
  /* @conditional-compile-remove(close-captions) */
  return (
    <_CaptionsSettingsModal
      {...CaptionsSettingsModalProps}
      {...handlers}
      strings={modalStrings}
      showModal={props.showCaptionsSettingsModal}
      onDismissCaptionsSettings={props.onDismissCaptionsSettings}
    />
  );
  return <></>;
};
