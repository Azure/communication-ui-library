// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, IButtonStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
import { CallWithChatCompositeStrings } from '../../index-public';
/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
import { CallCompositeStrings } from '../../index-public';
import { CallWithChatCompositeIcon } from './icons';
import { peoplePaneContainerTokens } from './styles/ParticipantContainer.styles';
import {
  copyLinkButtonContainerStyles,
  copyLinkButtonStackStyles,
  copyLinkButtonStyles,
  linkIconStyles,
  themedCopyLinkButtonStyles
} from './styles/PeoplePaneContent.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPeopleDropdown } from './AddPeopleDropdown';
/* @conditional-compile-remove(PSTN-calls) */
import { PhoneNumberIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';

/** @private */
export interface AddPeopleButtonProps {
  inviteLink?: string;
  mobileView?: boolean;
  participantList?: JSX.Element;
  strings:
    | CallWithChatCompositeStrings
    | /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */ CallCompositeStrings;
  /* @conditional-compile-remove(PSTN-calls) */
  onAddParticipant: (participant: PhoneNumberIdentifier, options?: AddPhoneNumberOptions) => void;
  alternateCallerId?: string;
}

/** @private */
export const AddPeopleButton = (props: AddPeopleButtonProps): JSX.Element => {
  const { inviteLink, mobileView, strings, participantList } = props;

  const theme = useTheme();

  const copyLinkButtonStylesThemed = useMemo(
    (): IButtonStyles => concatStyleSets(copyLinkButtonStyles, themedCopyLinkButtonStyles(mobileView, theme)),
    [mobileView, theme]
  );

  /* @conditional-compile-remove(PSTN-calls) */
  if (mobileView) {
    return (
      <AddPeopleDropdown
        strings={strings}
        mobileView={mobileView}
        inviteLink={inviteLink}
        onAddParticipant={props.onAddParticipant}
        alternateCallerId={props.alternateCallerId}
      />
    );
  } else {
    return (
      <Stack tokens={peoplePaneContainerTokens}>
        <AddPeopleDropdown
          strings={strings}
          mobileView={mobileView}
          inviteLink={inviteLink}
          onAddParticipant={props.onAddParticipant}
          alternateCallerId={props.alternateCallerId}
        />
        {participantList}
      </Stack>
    );
  }

  if (mobileView) {
    return (
      <Stack>
        {inviteLink && (
          <Stack.Item styles={copyLinkButtonContainerStyles}>
            <PrimaryButton
              onClick={() => copy(inviteLink ?? '')}
              styles={copyLinkButtonStylesThemed}
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />}
              text={strings.copyInviteLinkButtonLabel}
            />
          </Stack.Item>
        )}
      </Stack>
    );
  } else {
    return (
      <Stack tokens={peoplePaneContainerTokens}>
        {inviteLink && (
          <Stack styles={copyLinkButtonStackStyles}>
            <DefaultButton
              text={strings.copyInviteLinkButtonLabel}
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />}
              onClick={() => copy(inviteLink ?? '')}
              styles={copyLinkButtonStylesThemed}
            />
          </Stack>
        )}
        {participantList}
      </Stack>
    );
  }
};
