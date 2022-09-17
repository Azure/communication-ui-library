// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import { SendDtmfDialpad, SendDtmfDialpadStrings } from '../../../common/SendDtmfDialpad';
import { useLocale } from '../../../localization/LocalizationProvider';

/** @private */
export const DtmfDialpad = (props: {
  isMobile?: boolean;
  showDialpad: boolean;
  setShowDialpad: (value: boolean) => void;
}): JSX.Element => {
  const { isMobile, showDialpad, setShowDialpad } = props;
  const dialpadStrings = useDialpadStringsTrampoline();
  // FIXME: useMemo
  const onDismissDialpad = (): void => {
    setShowDialpad(false);
  };
  return (
    <SendDtmfDialpad
      isMobile={!!isMobile}
      strings={dialpadStrings}
      showDialpad={showDialpad}
      onDismissDialpad={onDismissDialpad}
    />
  );
};

const useDialpadStringsTrampoline = (): SendDtmfDialpadStrings => {
  const locale = useLocale();
  return useMemo(() => {
    /* @conditional-compile-remove(PSTN-calls) */
    return {
      dialpadModalAriaLabel: locale.strings.call.dialpadModalAriaLabel,
      dialpadCloseModalButtonAriaLabel: locale.strings.call.dialpadCloseModalButtonAriaLabel,
      placeholderText: locale.strings.call.dtmfDialpadPlaceHolderText
    };
    return { dialpadModalAriaLabel: '', dialpadCloseModalButtonAriaLabel: '', placeholderText: '' };
  }, [locale]);
};
