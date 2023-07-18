// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, IButtonStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo, useState } from 'react';
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
import { Announcer } from '@internal/react-components';

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

  const [copyInviteLinkAnnouncerStrings, setCopyInviteLinkAnnouncerStrings] = useState<string>('');

  const copyLinkButtonStylesThemed = useMemo(
    (): IButtonStyles => concatStyleSets(copyLinkButtonStyles, themedCopyLinkButtonStyles(mobileView, theme)),
    [mobileView, theme]
  );
  /**
   * sets the announcement string for when the link is copied.
   */
  const toggleAnnouncerString = useCallback(() => {
    setCopyInviteLinkAnnouncerStrings(strings.copyInviteLinkActionedAriaLabel);
    /**
     * Clears the announcer string after the user clicks the
     * copyInviteLink button allowing it to be re-announced.
     */
    setTimeout(() => {
      setCopyInviteLinkAnnouncerStrings('');
    }, 3000);
  }, [strings.copyInviteLinkActionedAriaLabel]);

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
      <Stack tokens={peoplePaneContainerTokens} data-ui-id="people-pane-content">
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
            <Announcer announcementString={copyInviteLinkAnnouncerStrings} ariaLive={'polite'} />
            <PrimaryButton
              onClick={() => {
                copy(inviteLink ?? '');
                toggleAnnouncerString();
              }}
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
      <Stack tokens={peoplePaneContainerTokens} data-ui-id="people-pane-content">
        {inviteLink && (
          <Stack styles={copyLinkButtonStackStyles}>
            <Announcer announcementString={copyInviteLinkAnnouncerStrings} ariaLive={'polite'} />
            <DefaultButton
              text={strings.copyInviteLinkButtonLabel}
              onRenderIcon={() => <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />}
              onClick={() => {
                copy(inviteLink ?? '');
                toggleAnnouncerString();
              }}
              styles={copyLinkButtonStylesThemed}
            />
          </Stack>
        )}
        {participantList}
      </Stack>
    );
  }
};
