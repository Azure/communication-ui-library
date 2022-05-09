// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { concatStyleSets, IStyle, ITextFieldStyles, mergeStyles, TextField, useTheme } from '@fluentui/react';
import React, { useState } from 'react';
import { useLocale } from '../../localization';
import { containerStyles, digitStyles, rowStyles, subStyles, textFieldStyles } from './Dialpad.styles';

/**
 * Strings of {@link Dialpad} that can be overridden.
 *
 * @public
 */
export interface DialpadStrings {
  errorText: string;
  defaultText: string;
}

/**
 * Props for {@link Dialpad} component.
 *
 * @public
 */
export interface DialpadProps {
  strings?: DialpadStrings;
  containerStyles?: IStyle;
  rowStyles?: IStyle;
  textFieldStyles?: Partial<ITextFieldStyles>;
  digitStyles?: IStyle;
  subStyles?: IStyle;
}

/**
 * A component to allow users to enter phone number through clicking on dialpad/using keyboard
 *
 *
 * @public
 */
export const Dialpad = (props: DialpadProps): JSX.Element => {
  const localeStrings = useLocale().strings.dialpad;
  const strings = { ...localeStrings, ...props.strings };
  return <DialpadContainer errorText={strings.errorText} defaultText={strings.defaultText} {...props} />;
};

const formatPhoneNumber = (value: string, defaultText: string): string => {
  // if input value is default text then just return
  if (value === defaultText) {
    return value;
  }

  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) {
    return value;
  }

  // clean the input for any non-digit values.
  const phoneNumber = value.replace(/[^\d*#+]/g, '');

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // we need to return the value with no formatting if its less then four digits
  // this is to avoid weird behavior that occurs if you  format the area code to early
  // if phoneNumberLength is greater than 10 we don't do any formatting

  if (phoneNumberLength < 4 || phoneNumberLength > 10) {
    return phoneNumber;
  }

  // if phoneNumberLength is greater than 4 and less the 7 we start to return
  // the formatted number
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3)}`;
  }

  // finally, if the phoneNumberLength is greater then seven, we add the last
  // bit of formatting and return it.
  return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, phoneNumber.length)}`;
};

const DialpadContainer = (props: {
  errorText: string;
  defaultText: string;
  containerStyles?: IStyle;
  rowStyles?: IStyle;
  textFieldStyles?: Partial<ITextFieldStyles>;
  digitStyles?: IStyle;
  subStyles?: IStyle;
}): JSX.Element => {
  const theme = useTheme();
  const [textValue, setTextValue] = useState(props.defaultText);
  const [error, setError] = useState('');
  const onClickDialpad = (input: string): void => {
    setError('');
    if (textValue === props.defaultText) {
      setTextValue(input);
    } else {
      setTextValue(textValue + input);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setText = (e: any): void => {
    // if text content includes non-valid dialpad input return an error
    if (!`${e.target.value}`.match(/^[0-9*#+()-]*$/)) {
      setError(props.errorText);
    } else {
      setError('');
      setTextValue(e.target.value);
    }
  };

  return (
    <div className={mergeStyles(containerStyles(theme), props.containerStyles)}>
      <TextField
        styles={concatStyleSets(textFieldStyles(theme), props.textFieldStyles)}
        value={formatPhoneNumber(textValue, props.defaultText)}
        onChange={setText}
        errorMessage={error}
        onClick={() => {
          if (textValue === props.defaultText) {
            setTextValue('');
          }
        }}
        onFocus={() => {
          if (textValue === props.defaultText) {
            setTextValue('');
          }
        }}
      />
      <div className={mergeStyles(rowStyles(theme), props.rowStyles)}>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('1');
          }}
        >
          1
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('2');
          }}
        >
          2<div className={mergeStyles(subStyles(theme), props.subStyles)}>ABC</div>
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('3');
          }}
        >
          3<div className={mergeStyles(subStyles(theme), props.subStyles)}>DEF</div>
        </button>
      </div>
      <div className={mergeStyles(rowStyles(theme), props.rowStyles)}>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('4');
          }}
        >
          4<div className={mergeStyles(subStyles(theme), props.subStyles)}>GHI</div>
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('5');
          }}
        >
          5<div className={mergeStyles(subStyles(theme), props.subStyles)}>JKL</div>
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('6');
          }}
        >
          6<div className={mergeStyles(subStyles(theme), props.subStyles)}>MNO</div>
        </button>
      </div>
      <div className={mergeStyles(rowStyles(theme), props.rowStyles)}>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('7');
          }}
        >
          7<div className={mergeStyles(subStyles(theme), props.subStyles)}>PQRS</div>
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('8');
          }}
        >
          8<div className={mergeStyles(subStyles(theme), props.subStyles)}>TUV</div>
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('9');
          }}
        >
          9<div className={mergeStyles(subStyles(theme), props.subStyles)}>WXYZ</div>
        </button>
      </div>
      <div className={mergeStyles(rowStyles(theme), props.rowStyles)}>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('*');
          }}
        >
          *
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('0');
          }}
        >
          0<div className={mergeStyles(subStyles(theme), props.subStyles)}>+</div>
        </button>
        <button
          className={mergeStyles(digitStyles(theme), props.digitStyles)}
          onClick={() => {
            onClickDialpad('#');
          }}
        >
          #
        </button>
      </div>
    </div>
  );
};
