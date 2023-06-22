// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(raise-hands) */
import { ControlBarButtonStyles, RaiseHandButton } from '@internal/react-components';
/* @conditional-compile-remove(raise-hands) */
import React, { useMemo } from 'react';
/* @conditional-compile-remove(raise-hands) */
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
/* @conditional-compile-remove(raise-hands) */
import { usePropsFor } from '../../hooks/usePropsFor';
/* @conditional-compile-remove(raise-hands) */
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';

/* @conditional-compile-remove(raise-hands) */
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

/* @conditional-compile-remove(raise-hands) */
const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
