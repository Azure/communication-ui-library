// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import React from 'react';
import { _CaptionsSettingModal } from '@internal/react-components';
import { usePropsFor } from '../CallComposite/hooks/usePropsFor';

/** @private */
export const CaptionsSettingModal = (props: {
  showCaptionsSettingModal: boolean;
  onDismissCaptionsSetting: () => void;
}): JSX.Element => {
  const captionsSettingModalProps = usePropsFor(_CaptionsSettingModal);

  return (
    <_CaptionsSettingModal
      {...captionsSettingModalProps}
      showModal={props.showCaptionsSettingModal}
      onDismissCaptionsSetting={props.onDismissCaptionsSetting}
    />
  );
};
