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

const textFieldLabel = 'Display name';
const textFieldId = 'displayName';
const textFieldPlaceholder = 'Enter a name';
const emptyFieldErrorMsg = 'Name cannot be empty';

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
      label={textFieldLabel}
      required={true}
      className={inputBoxStyle}
      onChange={onNameTextChange}
      id={textFieldId}
      placeholder={textFieldPlaceholder}
      onKeyDown={(ev) => {
        if (ev.which === ENTER_KEY) {
          validateName && validateName();
        }
      }}
      styles={TextFieldStyleProps}
      errorMessage={isEmpty ? emptyFieldErrorMsg : undefined}
    />
  );
};
