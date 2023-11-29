// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

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
import { _isInLobbyOrConnecting } from '@internal/calling-component-bindings';
import { getCallStatus } from '../../selectors/baseSelectors';
import { useSelector } from '../../hooks/useSelector';

/* @conditional-compile-remove(reaction) */
/** @private */
export const Reaction = (props: {
  // The value of `CallControlOptions.reactionButton`.
  option?: boolean | { disabled: boolean };
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
}): JSX.Element => {
  const reactionButtonProps = usePropsFor(ReactionButton) as ReactionButtonProps;
  const callStatus = useSelector(getCallStatus);
  const styles = useMemo(() => concatButtonBaseStyles(props.styles ?? {}), [props.styles]);

  let raiseHandButtonDisabled = isDisabled(props.option);

  if (_isInLobbyOrConnecting(callStatus)) {
    raiseHandButtonDisabled = true;
  }

  return (
    <ReactionButton
      data-ui-id="call-composite-reaction-button"
      {...reactionButtonProps}
      showLabel={props.displayType !== 'compact'}
      disabled={raiseHandButtonDisabled || props.disabled}
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

