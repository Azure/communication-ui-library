// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { TextFieldStyleProps, inputBoxStyle, inputBoxTextStyle } from '../styles/DisplayNameField.styles';
import { TextField } from '@fluentui/react';

export const MAXIMUM_LENGTH_OF_NAME = 10;
export const ENTER_KEY = 13;

interface DisplayNameFieldProps {
  setName(displayName: string): void;
  setEmptyWarning?(isEmpty: boolean): void;
  setNameLengthExceedLimit?(isNameLengthExceedLimit: boolean): void;
  isEmpty?: boolean;
  isNameLengthExceedLimit?: boolean;
  defaultName?: string;
  validateName?(): void;
}

export const DisplayNameField = (props: DisplayNameFieldProps): JSX.Element => {
  const {
    setName,
    setEmptyWarning,
    setNameLengthExceedLimit,
    isEmpty,
    isNameLengthExceedLimit,
    defaultName,
    validateName
  } = props;

  const onNameTextChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (newValue === undefined) return;

    setName(newValue);
    if (setEmptyWarning && !newValue) {
      setEmptyWarning(true);
    } else if (setNameLengthExceedLimit && newValue.length > MAXIMUM_LENGTH_OF_NAME) {
      setNameLengthExceedLimit(true);
    } else {
      setEmptyWarning && setEmptyWarning(false);
      setNameLengthExceedLimit && setNameLengthExceedLimit(false);
    }
  };

  return (
    <TextField
      autoComplete="off"
      defaultValue={defaultName}
      inputClassName={inputBoxTextStyle}
      ariaLabel="Choose your name"
      className={inputBoxStyle}
      onChange={onNameTextChange}
      id="displayName"
      placeholder="Enter a name"
      onKeyDown={(ev) => {
        if (ev.which === ENTER_KEY) {
          validateName && validateName();
        }
      }}
      styles={TextFieldStyleProps}
      errorMessage={
        isEmpty ? 'Name cannot be empty' : isNameLengthExceedLimit ? 'Name cannot be over 10 characters' : undefined
      }
    />
  );
};
