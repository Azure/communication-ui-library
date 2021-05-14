// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ErrorHandlingProps, WithErrorHandling } from 'react-composites';
import {
  TextFieldStyleProps,
  inputBoxStyle,
  inputBoxTextStyle,
  inputBoxWarningStyle,
  labelFontStyle,
  warningStyle
} from './styles/DisplayNameField.styles';
import { ENTER_KEY, MAXIMUM_LENGTH_OF_NAME } from './utils/constants';

import React from 'react';
import { TextField } from '@fluentui/react';

interface DisplayNameFieldProps {
  setName(displayName: string): void;
  setEmptyWarning(isEmpty: boolean): void;
  setNameLengthExceedLimit(isNameLengthExceedLimit: boolean): void;
  isEmpty: boolean;
  isNameLengthExceedLimit: boolean;
  defaultName?: string;
  validateName?(): void;
}

const DisplayNameFieldComponent = (props: DisplayNameFieldProps & ErrorHandlingProps): JSX.Element => {
  const {
    setName,
    setEmptyWarning,
    setNameLengthExceedLimit,
    isEmpty,
    isNameLengthExceedLimit,
    defaultName,
    validateName
  } = props;

  const onNameTextChange = (event: any): void => {
    setName(event.target.value);
    if (!event.target.value) {
      setEmptyWarning(true);
    } else if (event.target.value.length > MAXIMUM_LENGTH_OF_NAME) {
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
        errorMessage={
          isEmpty ? (
            <div role="alert" className={warningStyle}>
              {' '}
              Name cannot be empty{' '}
            </div>
          ) : isNameLengthExceedLimit ? (
            <div role="alert" className={warningStyle}>
              {' '}
              Name cannot be over 10 characters{' '}
            </div>
          ) : undefined
        }
      />
    </div>
  );
};

export const DisplayNameField = (props: DisplayNameFieldProps & ErrorHandlingProps): JSX.Element =>
  WithErrorHandling(DisplayNameFieldComponent, props);
