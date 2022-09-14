// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, IButtonStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
import { CallWithChatCompositeStrings } from '../../index-public';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallCompositeStrings } from '../../index-public';
/* @conditional-compile-remove(rooms) */
import { _usePermissions } from '@internal/react-components';
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
import { CommunicationIdentifier } from '@azure/communication-common';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPhoneNumberOptions } from '@azure/communication-calling';
import { useAdapter } from '../CallComposite/adapter/CallAdapterProvider';

/** @private */
export interface AddPeopleButtonProps {
  inviteLink?: string;
  mobileView?: boolean;
  participantList?: JSX.Element;
  strings: CallWithChatCompositeStrings | /* @conditional-compile-remove(one-to-n-calling) */ CallCompositeStrings;
  /* @conditional-compile-remove(PSTN-calls) */
  onAddParticipant: (participant: CommunicationIdentifier, options?: AddPhoneNumberOptions) => void;
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

  const isRoomsCall = 'roomId' in useAdapter().getState()['locator'];

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
        {!isRoomsCall && (
          <AddPeopleDropdown
            strings={strings}
            mobileView={mobileView}
            inviteLink={inviteLink}
            onAddParticipant={props.onAddParticipant}
            alternateCallerId={props.alternateCallerId}
          />
        )}
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
