// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TextFieldStyleProps, inputBoxStyle, inputBoxTextStyle } from './styles/DisplayNameField.styles';
import { labelFontStyle } from './styles/ConfiguratonScreen.styles';
import { TextField } from '@fluentui/react';

interface TeamsMeetingLinkFieldProps {
  setMeetingLink(link: string): void;
}

export const TeamsMeetingLinkField = (props: TeamsMeetingLinkFieldProps): JSX.Element => {
  const { setMeetingLink } = props;

  const onChange = (event: any): void => {
    setMeetingLink(event.target.value);
  };

  return (
    <div>
      <div className={labelFontStyle}>Teams Meeting Link</div>
      <TextField
        autoComplete="off"
        inputClassName={inputBoxTextStyle}
        ariaLabel="Teams Meeting Link"
        className={inputBoxStyle}
        onChange={onChange}
        id="teamsMeetingLink"
        placeholder="Enter Teams Meeting Link"
        styles={TextFieldStyleProps}
      />
    </div>
  );
};
