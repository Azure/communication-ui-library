// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButtonStyles, ScreenShareButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { usePropsFor } from '../../hooks/usePropsFor';
import { CallControlDisplayType } from '../../types/CallControlOptions';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';

/** @private */
export const ScreenShare = (props: {
  // The value of `CallControlOptions.screenShareButton`.
  option?: boolean | { disabled: boolean };
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
}): JSX.Element => {
  const screenShareButtonProps = usePropsFor(ScreenShareButton);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);
  return (
    <ScreenShareButton
      data-ui-id="call-composite-screenshare-button"
      {...screenShareButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={isDisabled(props.option)}
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
