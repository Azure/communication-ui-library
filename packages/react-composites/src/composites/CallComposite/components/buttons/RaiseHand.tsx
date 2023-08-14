// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/* @conditional-compile-remove(raise-hand) */
import { ControlBarButtonStyles, RaiseHandButton } from '@internal/react-components';
/* @conditional-compile-remove(raise-hand) */
import React, { useMemo } from 'react';
/* @conditional-compile-remove(raise-hand) */
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
/* @conditional-compile-remove(raise-hand) */
import { usePropsFor } from '../../hooks/usePropsFor';
/* @conditional-compile-remove(raise-hand) */
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';

/* @conditional-compile-remove(raise-hand) */
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

  const raiseHandButtonDisabled = isDisabled(props.option);

  return (
    <RaiseHandButton
      data-ui-id="call-composite-raisehand-button"
      {...raiseHandButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={raiseHandButtonDisabled || props.disabled}
      styles={styles}
    />
  );
};

/* @conditional-compile-remove(raise-hand) */
const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
