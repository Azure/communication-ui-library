// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ControlBarButtonStyles, ScreenShareButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';
import { getIsRoomsCall, getRole } from '../../selectors/baseSelectors';
import { useSelector } from '../../hooks/useSelector';

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
  const isRoomsCall = useSelector(getIsRoomsCall);
  const role = useSelector(getRole);

  const screenShareButtonDisabled = (): boolean => {
    return screenShareButtonProps?.disabled ?? isDisabled(props.option);
    return isDisabled(props.option);
  };

  return (
    <ScreenShareButton
      data-ui-id="call-composite-screenshare-button"
      {...screenShareButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={screenShareButtonDisabled() || props.disabled || !!(isRoomsCall && role === 'Unknown')}
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
