// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  TextFieldStyleProps,
  inputBoxStyle,
  inputBoxTextStyle,
  inputBoxWarningStyle,
  labelFontStyle,
  warningStyle
} from './styles/DisplayNameField.styles';

import React from 'react';
import { TextField } from '@fluentui/react';

export const ENTER_KEY = 13;
export const MAXIMUM_LENGTH_OF_NAME = 10;

interface DisplayNameFieldProps {
  setName(displayName: string): void;
  setEmptyWarning(isEmpty: boolean): void;
  setNameLengthExceedLimit(isNameLengthExceedLimit: boolean): void;
  isEmpty: boolean;
  isNameLengthExceedLimit: boolean;
  defaultName?: string;
  validateName?(): void;
}

const DisplayNameFieldComponent = (props: DisplayNameFieldProps): JSX.Element => {
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
    if (!newValue) {
      setEmptyWarning(true);
    } else if (newValue.length > MAXIMUM_LENGTH_OF_NAME) {
      setNameLengthExceedLimit(true);
    } else {
      setEmptyWarning(false);
      setNameLengthExceedLimit(false);
    }
  };

  return (
    <div>
      <div className={labelFontStyle}>Name</div>
      <TextField
        autoComplete="off"
        defaultValue={defaultName}
        inputClassName={inputBoxTextStyle}
        ariaLabel="Choose your name"
        borderless={true}
        className={isEmpty || isNameLengthExceedLimit ? inputBoxWarningStyle : inputBoxStyle}
        onChange={onNameTextChange}
        id="displayName"
        placeholder="Enter your name"
        onKeyDown={(ev) => {
          if (ev.which === ENTER_KEY) {
            validateName && validateName();
          }
        }}
        styles={TextFieldStyleProps}
      />
      {(isEmpty && (
        <div role="alert" className={warningStyle}>
          {' '}
          Name cannot be empty{' '}
        </div>
      )) ||
        (isNameLengthExceedLimit && (
          <div role="alert" className={warningStyle}>
            {' '}
            Name cannot be over 10 characters{' '}
          </div>
        ))}
    </div>
  );
};

export default (props: DisplayNameFieldProps): JSX.Element => <DisplayNameFieldComponent {...props} />;
