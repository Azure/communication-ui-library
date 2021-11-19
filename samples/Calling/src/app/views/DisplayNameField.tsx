// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TextFieldStyleProps, inputBoxStyle, inputBoxTextStyle } from '../styles/DisplayNameField.styles';
import { TextField } from '@fluentui/react';

export const ENTER_KEY = 13;

interface DisplayNameFieldProps {
  setName(displayName: string): void;
  setEmptyWarning?(isEmpty: boolean): void;
  isEmpty?: boolean;
  defaultName?: string;
  validateName?(): void;
}

const TEXTFIELD_LABEL = 'Display name';
const TEXTFIELD_ID = 'displayName';
const TEXTFIELD_PLACEHOLDER = 'Enter a name';
const TEXTFIELD_EMPTY_ERROR_MSG = 'Name cannot be empty';

export const DisplayNameField = (props: DisplayNameFieldProps): JSX.Element => {
  const { setName, setEmptyWarning, isEmpty, defaultName, validateName } = props;

  const onNameTextChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (newValue === undefined) return;

    setName(newValue);
    if (setEmptyWarning && !newValue) {
      setEmptyWarning(true);
    } else {
      setEmptyWarning && setEmptyWarning(false);
    }
  };

  return (
    <TextField
      autoComplete="off"
      defaultValue={defaultName}
      inputClassName={inputBoxTextStyle}
      label={TEXTFIELD_LABEL}
      required={true}
      className={inputBoxStyle}
      onChange={onNameTextChange}
      id={TEXTFIELD_ID}
      placeholder={TEXTFIELD_PLACEHOLDER}
      onKeyDown={(ev) => {
        if (ev.which === ENTER_KEY) {
          validateName && validateName();
        }
      }}
      styles={TextFieldStyleProps}
      errorMessage={isEmpty ? TEXTFIELD_EMPTY_ERROR_MSG : undefined}
    />
  );
};
