// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Icon, PrimaryButton, Separator, Stack, TextField } from '@fluentui/react';
import {
  copyIconStyle,
  copyLinkButtonStyle,
  buttonWithIconStyles,
  footerMainTextStyle,
  paneFooterStyles,
  paneFooterTokens,
  textFieldStyles
} from '../styles/Footer.styles';

import React from 'react';

const invitePeopleString = 'Invite people to join';
const copyJoinInfoString = 'Copy join info';

const copyJoinLink = (): void => {
  const inputElement = document.getElementById('inputText') as HTMLInputElement;
  inputElement.select();
  document.execCommand('copy');
};

export const Footer = (): JSX.Element => {
  return (
    <Stack styles={paneFooterStyles} tokens={paneFooterTokens}>
      <Separator />
      <div className={footerMainTextStyle}>{invitePeopleString}</div>
      <TextField styles={textFieldStyles} id="inputText" type="text" value={`${document.baseURI}`}></TextField>
      <PrimaryButton
        className={copyLinkButtonStyle}
        styles={buttonWithIconStyles}
        text={copyJoinInfoString}
        onClick={copyJoinLink}
        onRenderIcon={() => <Icon iconName="Copy" className={copyIconStyle} />}
      />
    </Stack>
  );
};
