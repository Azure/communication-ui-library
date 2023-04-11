// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { _CaptionsSettingModal } from '@internal/react-components';
import { useAdaptedSelector } from '../CallComposite/hooks/useAdaptedSelector';
import { useHandlers } from '../CallComposite/hooks/useHandlers';

/** @private */
export const CaptionsSettingModal = (props: {
  showCaptionsSettingModal: boolean;
  onDismissCaptionsSetting: () => void;
}): JSX.Element => {
  const captionsSettingModalProps = useAdaptedSelector(_CaptionsSettingModal);
  const handlers = useHandlers(_CaptionsSettingModal);

  return (
    <_CaptionsSettingModal
      {...captionsSettingModalProps}
      {...handlers}
      showModal={props.showCaptionsSettingModal}
      onDismissCaptionsSetting={props.onDismissCaptionsSetting}
    />
  );
};
