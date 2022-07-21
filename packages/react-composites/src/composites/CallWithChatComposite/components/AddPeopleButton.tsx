// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, IButtonStyles, PrimaryButton, Stack, useTheme } from '@fluentui/react';
import copy from 'copy-to-clipboard';
import React, { useMemo } from 'react';
import { CallCompositeStrings, CallWithChatCompositeStrings } from '../../../index-public';
import { CallWithChatCompositeIcon } from '../../common/icons';
import { peoplePaneContainerTokens } from '../../common/styles/ParticipantContainer.styles';
import {
  copyLinkButtonContainerStyles,
  copyLinkButtonStackStyles,
  copyLinkButtonStyles,
  linkIconStyles,
  themedCopyLinkButtonStyles
} from '../../common/styles/PeoplePaneContent.styles';
/* @conditional-compile-remove(PSTN-calls) */
import { AddPeopleDropdown, AddPeopleDropdownStrings } from './AddPeopleDropdown';

/** @private */
export interface AddPeopleButtonProps {
  inviteLink?: string;
  mobileView?: boolean;
  participantList?: JSX.Element;
  strings: CallWithChatCompositeStrings | CallCompositeStrings;
}

/** @private */
export const AddPeopleButton = (props: AddPeopleButtonProps): JSX.Element => {
  const { inviteLink, mobileView, strings, participantList } = props;

  const theme = useTheme();

  const copyLinkButtonStylesThemed = useMemo(
    (): IButtonStyles => concatStyleSets(copyLinkButtonStyles, themedCopyLinkButtonStyles(mobileView, theme)),
    [mobileView, theme]
  );

  if (mobileView) {
    /* @conditional-compile-remove(PSTN-calls) */
    return (
      <AddPeopleDropdown
        strings={addPeopleDropdownStringsTrampoline(strings)}
        mobileView={mobileView}
        inviteLink={inviteLink}
      />
    );

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
  }

  /* @conditional-compile-remove(PSTN-calls) */
  return (
    <Stack tokens={peoplePaneContainerTokens}>
      <AddPeopleDropdown
        strings={addPeopleDropdownStringsTrampoline(strings)}
        mobileView={mobileView}
        inviteLink={inviteLink}
      />
      {participantList}
    </Stack>
  );

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
};

function addPeopleDropdownStringsTrampoline(
  strings: CallWithChatCompositeStrings | CallCompositeStrings
): AddPeopleDropdownStrings {
  /* @conditional-compile-remove(PSTN-calls) */
  return strings;
  return strings as unknown as AddPeopleDropdownStrings;
}
