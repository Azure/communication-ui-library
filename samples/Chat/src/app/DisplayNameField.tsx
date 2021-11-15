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
import { ENTER_KEY } from './utils/constants';

import React from 'react';
import { TextField } from '@fluentui/react';

interface DisplayNameFieldProps {
  setName(displayName: string): void;
  setEmptyWarning(isEmpty: boolean): void;
  isEmpty: boolean;
  defaultName?: string;
  validateName?(): void;
}

const DisplayNameFieldComponent = (props: DisplayNameFieldProps): JSX.Element => {
  const { setName, setEmptyWarning, isEmpty, defaultName, validateName } = props;

  const onNameTextChange = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (newValue === undefined) return;

    setName(newValue);
    if (!newValue) {
      setEmptyWarning(true);
    } else {
      setEmptyWarning(false);
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
        className={isEmpty ? inputBoxWarningStyle : inputBoxStyle}
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
          ) : undefined
        }
      />
    </div>
  );
};

export const DisplayNameField = (props: DisplayNameFieldProps): JSX.Element => <DisplayNameFieldComponent {...props} />;
