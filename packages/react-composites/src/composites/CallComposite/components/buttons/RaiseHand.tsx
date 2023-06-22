// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButtonStyles, RaiseHandButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';

/** @private */
export const RaiseHand = (props: {
  // The value of `CallControlOptions.raiseHandButton`.
  option?: boolean | { disabled: boolean };
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const raiseHandButtonProps = usePropsFor(RaiseHandButton);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);

  const raiseHandButtonDisabled = (): boolean => {
    /* @conditional-compile-remove(PSTN-calls) */
    return raiseHandButtonProps?.disabled ? raiseHandButtonProps.disabled : isDisabled(props.option);
    return isDisabled(props.option);
  };

  return (
    <RaiseHandButton
      data-ui-id="call-composite-raisehand-button"
      {...raiseHandButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={raiseHandButtonDisabled() || props.disabled}
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
