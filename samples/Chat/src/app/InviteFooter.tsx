// © Microsoft Corporation. All rights reserved.

import { Icon, PrimaryButton, Stack, TextField } from '@fluentui/react';
import {
  copyIconStyle,
  copyLinkButtonStyle,
  copyLinkTextStyle,
  footerMainTextStyle,
  paneFooterTokens,
  textFieldStyles
} from './styles/InviteFooter.styles';
import {
  inviteFooterStackContainerStyles,
  inviteFooterStackStyles,
  saveButtonTextStyle
} from './styles/InviteFooter.styles';

import React from 'react';

const copyJoinLink = (): void => {
  const inputElement: HTMLInputElement = document.getElementById('inputText') as HTMLInputElement;
  inputElement.select();
  document.execCommand('copy');
  document.getElementById('copyLinkButton')?.focus();
};

export const InviteFooter = (): JSX.Element => {
  const invitePeopleString = 'Invite people to join';
  const copyJoinInfoString = 'Copy invite link';

  return (
    <Stack styles={inviteFooterStackStyles} className={inviteFooterStackContainerStyles} tokens={paneFooterTokens}>
      <div className={footerMainTextStyle}>{invitePeopleString}</div>
      <TextField
        inputClassName={copyLinkTextStyle}
        tabIndex={-1}
        ariaLabel="Join link"
        styles={textFieldStyles}
        id="inputText"
        type="text"
        value={`${document.baseURI}`}
      ></TextField>
      <PrimaryButton tab-index="-1" id="copyLinkButton" className={copyLinkButtonStyle} onClick={copyJoinLink}>
        <Icon iconName="Copy" className={copyIconStyle} />
        <div className={saveButtonTextStyle}>{copyJoinInfoString}</div>
      </PrimaryButton>
    </Stack>
  );
};
