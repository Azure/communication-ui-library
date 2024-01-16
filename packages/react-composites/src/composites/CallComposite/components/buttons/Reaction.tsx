// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(reaction) */
import { ControlBarButtonStyles, ReactionButton, ReactionButtonProps } from '@internal/react-components';
/* @conditional-compile-remove(reaction) */
import React, { useMemo } from 'react';
/* @conditional-compile-remove(reaction) */
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
/* @conditional-compile-remove(reaction) */
import { usePropsFor } from '../../hooks/usePropsFor';
/* @conditional-compile-remove(reaction) */
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';

/* @conditional-compile-remove(reaction) */
/** @private */
export const Reaction = (props: {
  // The value of `CallControlOptions.reactionButton`.
  option?: boolean | { disabled: boolean };
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const reactionButtonProps = usePropsFor(ReactionButton) as unknown as ReactionButtonProps;
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);

  const reactionButtonDisabled = isDisabled(props.option) || reactionButtonProps.disabled;

  return (
    <ReactionButton
      data-ui-id="call-composite-reaction-button"
      {...reactionButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={reactionButtonDisabled || props.disabled}
      styles={styles}
    />
  );
};

/* @conditional-compile-remove(reaction) */
const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
