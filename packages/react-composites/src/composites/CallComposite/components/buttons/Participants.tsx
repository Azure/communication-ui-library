// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButtonStyles, ParticipantMenuItemsCallback, ParticipantsButton } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallControlDisplayType } from '../../../common/types/CommonCallControlOptions';
import { usePropsFor } from '../../hooks/usePropsFor';
import { concatButtonBaseStyles, participantButtonWithIncreasedTouchTargets } from '../../styles/Buttons.styles';

/** @private */
export const Participants = (props: {
  // The value of `CallControlOptions.participantsButton`.
  option?: boolean | { disabled: boolean };
  callInvitationURL?: string;
  onFetchParticipantMenuItems?: ParticipantMenuItemsCallback;
  displayType?: CallControlDisplayType;
  increaseFlyoutItemSize?: boolean;
  styles?: ControlBarButtonStyles;
  isMobile?: boolean;
  disabled?: boolean;
}): JSX.Element => {
  const participantsButtonProps = usePropsFor(ParticipantsButton);
  const participantsButtonStyles = useMemo(
    () =>
      concatButtonBaseStyles(
        props.increaseFlyoutItemSize ? participantButtonWithIncreasedTouchTargets : {},
        props.styles ?? {}
      ),
    [props.increaseFlyoutItemSize, props.styles]
  );
  return (
    <ParticipantsButton
      data-ui-id="call-composite-participants-button"
      {...participantsButtonProps}
      showLabel={props.displayType !== 'compact'}
      callInvitationURL={props.callInvitationURL}
      onFetchParticipantMenuItems={props.onFetchParticipantMenuItems}
      disabled={isDisabled(props.option) || props.disabled}
      styles={participantsButtonStyles}
      showParticipantOverflowTooltip={!props.isMobile}
    />
  );
};

const isDisabled = (option?: boolean | { disabled: boolean }): boolean => {
  if (option === undefined || option === true || option === false) {
    return false;
  }
  return option.disabled;
};
