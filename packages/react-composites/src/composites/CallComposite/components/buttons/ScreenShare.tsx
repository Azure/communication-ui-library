// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBarButtonStyles, ScreenShareButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
/* @conditional-compile-remove(rooms) */
import { useAdapter } from '../../adapter/CallAdapterProvider';

/** @private */
export const ScreenShare = (props: {
  // The value of `CallControlOptions.screenShareButton`.
  option?: boolean | { disabled: boolean };
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);
  /* @conditional-compile-remove(rooms) */
  const adapter = useAdapter();
  /* @conditional-compile-remove(rooms) */
  const isRoomsCall = adapter.getState().isRoomsCall;

  const screenShareButtonDisabled = (): boolean => {
    /* @conditional-compile-remove(capabilities) */ /* @conditional-compile-remove(PSTN-calls) */
    return screenShareButtonProps?.disabled ?? isDisabled(props.option);
    return isDisabled(props.option);
  };

  return (
    <ScreenShareButton
      data-ui-id="call-composite-screenshare-button"
      {...screenShareButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={
        screenShareButtonDisabled() ||
        props.disabled ||
        /* @conditional-compile-remove(rooms) */ (isRoomsCall && adapter.getState().call?.role === 'Unknown')
      }
      styles={styles}
    />
  );
};

const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
