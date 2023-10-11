// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { People20Filled, People20Regular } from '@fluentui/react-icons';
import { useTheme } from '@azure/communication-react';
import { IconButton, mergeStyles } from '@fluentui/react';

export type PeopleButtonProps = {
  isParticipantsDisplayed: boolean;
  setHideParticipants(hideParticipants: boolean): void;
};

export const PeopleButton = (props: PeopleButtonProps): JSX.Element => {
  const theme = useTheme();
  const participantListExpandedString = 'Participants list Button Expanded';
  const participantListCollapsedString = 'Participants list Button Collapsed';
  return (
    <IconButton
      onRenderIcon={() => (props.isParticipantsDisplayed ? <People20Filled /> : <People20Regular />)}
      className={mergeStyles({ color: theme.palette.neutralPrimaryAlt })}
      onClick={() => props.setHideParticipants(props.isParticipantsDisplayed)}
      ariaLabel={props.isParticipantsDisplayed ? participantListExpandedString : participantListCollapsedString}
    />
  );
};
