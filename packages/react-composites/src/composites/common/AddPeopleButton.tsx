// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, DefaultButton, IButtonStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import copy from 'copy-to-clipboard';
import React, { useCallback, useMemo, useRef, useState } from 'react';
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

  const dateInviteLinkCopied = useRef<number | undefined>(undefined);
  const [inviteLinkCopiedRecently, setInviteLinkCopiedRecently] = useState(false);
  const onCopyInviteLink = useCallback(() => {
    setInviteLinkCopiedRecently(true);
    dateInviteLinkCopied.current = Date.now();
    setTimeout(() => {
      if (dateInviteLinkCopied.current && Date.now() - dateInviteLinkCopied.current >= 2000) {
        setInviteLinkCopiedRecently(false);
      }
    }, 2000);
  }, [setInviteLinkCopiedRecently, dateInviteLinkCopied]);

  /* @conditional-compile-remove(PSTN-calls) */
  if (mobileView) {
    return (
      <AddPeopleDropdown
        strings={strings}
        mobileView={mobileView}
        inviteLink={inviteLink}
        onAddParticipant={props.onAddParticipant}
        alternateCallerId={props.alternateCallerId}
        onCopyInviteLink={onCopyInviteLink}
        inviteLinkCopiedRecently={inviteLinkCopiedRecently}
      />
    );
  } else {
    return (
      <Stack tokens={peoplePaneContainerTokens} data-ui-id="people-pane-content" verticalFill>
        <AddPeopleDropdown
          strings={strings}
          mobileView={mobileView}
          inviteLink={inviteLink}
          onAddParticipant={props.onAddParticipant}
          alternateCallerId={props.alternateCallerId}
          onCopyInviteLink={onCopyInviteLink}
          inviteLinkCopiedRecently={inviteLinkCopiedRecently}
        />
        <Stack.Item grow styles={{ root: { overflowY: 'hidden' } }}>
          {participantList}
        </Stack.Item>
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
                onCopyInviteLink();
              }}
              styles={copyLinkButtonStylesThemed}
              onRenderIcon={() =>
                inviteLinkCopiedRecently ? (
                  <CallWithChatCompositeIcon iconName="Checkmark" />
                ) : (
                  <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />
                )
              }
              text={
                inviteLinkCopiedRecently ? strings.copyInviteLinkButtonActionedLabel : strings.copyInviteLinkButtonLabel
              }
            />
          </Stack.Item>
        )}
      </Stack>
    );
  } else {
    return (
      <Stack tokens={peoplePaneContainerTokens} data-ui-id="people-pane-content" verticalFill>
        {inviteLink && (
          <Stack styles={copyLinkButtonStackStyles}>
            <Announcer announcementString={copyInviteLinkAnnouncerStrings} ariaLive={'polite'} />
            <DefaultButton
              text={
                inviteLinkCopiedRecently ? strings.copyInviteLinkButtonActionedLabel : strings.copyInviteLinkButtonLabel
              }
              onRenderIcon={() =>
                inviteLinkCopiedRecently ? (
                  <CallWithChatCompositeIcon iconName="Checkmark" />
                ) : (
                  <CallWithChatCompositeIcon iconName="Link" style={linkIconStyles} />
                )
              }
              onClick={() => {
                copy(inviteLink ?? '');
                toggleAnnouncerString();
                onCopyInviteLink();
              }}
              styles={copyLinkButtonStylesThemed}
            />
          </Stack>
        )}
        <Stack.Item grow styles={{ root: { overflowY: 'hidden' } }}>
          {participantList}
        </Stack.Item>
      </Stack>
    );
  }
};
