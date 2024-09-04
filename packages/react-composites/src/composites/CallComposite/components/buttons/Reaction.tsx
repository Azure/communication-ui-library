// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ReactionResources } from '@internal/react-components';
import { ControlBarButtonStyles, ReactionButton, ReactionButtonProps } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles } from '../../styles/Buttons.styles';

/** @private */
export const Reaction = (props: {
  // The value of `CallControlOptions.reactionButton`.
  reactionResource: ReactionResources;
  option?: boolean | { disabled: boolean };
  displayType?: CallControlDisplayType;
  styles?: ControlBarButtonStyles;
  disabled?: boolean;
  disableTooltip?: boolean;
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
      disableTooltip={props.disableTooltip}
      persistMenu={true}
      reactionResources={props.reactionResource}
    />
  );
};

const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
