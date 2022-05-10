// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  DefaultButton,
  IButtonStyles,
  IStyle,
  ITextFieldStyles,
  mergeStyles,
  Stack,
  Text,
  TextField,
  useTheme
} from '@fluentui/react';
import React, { useState } from 'react';
import { useLocale } from '../../localization';
import { buttonStyles, containerStyles, digitStyles, subStyles, textFieldStyles } from './Dialpad.styles';

/**
 * Strings of {@link Dialpad} that can be overridden.
 *
 * @beta
 */
export interface DialpadStrings {
  errorText: string;
  defaultText: string;
}

/**
 * Styles for {@link Dialpad} component.
 *
 * @beta
 */
export interface DialpadStyles {
  root?: IStyle;
  button?: IButtonStyles;
  textField?: Partial<ITextFieldStyles>;
  digit?: IStyle;
  subDigit?: IStyle;
}

/**
 * Type for  {@link DialpadButton} input
 *
 * @beta
 */
export interface DialpadButtonsType {
  primaryContent: string;
  secondaryContent?: string;
}

/**
 * Props for {@link Dialpad} component.
 *
 * @beta
 */
export interface DialpadProps {
  strings?: DialpadStrings;
  dialpadButtons?: DialpadButtonsType[][];
  styles?: Partial<DialpadStyles>;
}

/**
 * A component to allow users to enter phone number through clicking on dialpad/using keyboard
 *
 *
 * @beta
 */
export const Dialpad = (props: DialpadProps): JSX.Element => {
  const localeStrings = useLocale().strings.dialpad;
  const strings = { ...localeStrings, ...props.strings };
  return <DialpadContainer errorText={strings.errorText} defaultText={strings.defaultText} {...props} />;
};

const formatPhoneNumber = (value: string): string => {
  // if input value is falsy eg if the user deletes the input, then just return
  if (!value) {
    return value;
  }

  // clean the input for any non-digit values.
  let phoneNumber = value.replace(/[^\d*#+]/g, '');

  // if phone number starts with 1, format like 1 (xxx)xxx-xxxx.
  // if phone number starts with +, we format like +x (xxx)xxx-xxxx.
  // For now we are only supporting NA phone number formatting with country code +x
  // first we chop off the countrycode then we add it on when returning
  let countryCodeNA = '';
  if (phoneNumber[0] === '1') {
    countryCodeNA = '1 ';

    phoneNumber = phoneNumber.slice(1, phoneNumber.length);
  } else if (phoneNumber[0] === '+') {
    countryCodeNA = phoneNumber.slice(0, 2) + ' ';
    phoneNumber = phoneNumber.slice(2, phoneNumber.length);
  }

  // phoneNumberLength is used to know when to apply our formatting for the phone number
  const phoneNumberLength = phoneNumber.length;

  // we need to return the value with no formatting if its less then four digits
  // this is to avoid weird behavior that occurs if you  format the area code too early
  // if phoneNumberLength is greater than 10 we don't do any formatting

  if (phoneNumberLength < 4 || phoneNumberLength > 10) {
    // no formatting in this case, remove ' ' behind countrycode
    return countryCodeNA.replace(' ', '') + phoneNumber;
  }

  // if phoneNumberLength is greater than 4 and less the 7 we start to return
  // the formatted number
  if (phoneNumberLength < 7) {
    return `${countryCodeNA}(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }

  // finally, if the phoneNumberLength is greater then seven, we add the last
  // bit of formatting and return it.
  return `${countryCodeNA}(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(
    6,
    phoneNumber.length
  )}`;
};

const DialpadButton = (props: {
  primaryContent: string;
  secondaryContent?: string;
  styles?: Partial<DialpadStyles>;
  onClick: (input: string) => void;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <DefaultButton
      onClick={() => {
        props.onClick(props.primaryContent);
      }}
      styles={concatStyleSets(buttonStyles(theme), props.styles?.button)}
    >
      <Stack>
        <Text className={mergeStyles(digitStyles(theme), props.styles?.digit)}>{props.primaryContent}</Text>

        <Text className={mergeStyles(subStyles(theme), props.styles?.subDigit)}>{props.secondaryContent ?? ' '}</Text>
      </Stack>
    </DefaultButton>
  );
};

const DialpadContainer = (props: {
  errorText: string;
  defaultText: string;
  dialpadButtons?: DialpadButtonsType[][];
  styles?: Partial<DialpadStyles>;
}): JSX.Element => {
  const theme = useTheme();
  const [textValue, setTextValue] = useState('');
  const [error, setError] = useState('');
  const onClickDialpad = (input: string): void => {
    setError('');

    setTextValue(textValue + input);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setText = (e: any): void => {
    // if text content includes non-valid dialpad input return an error
    if (!`${e.target.value}`.match(/^[0-9\s*#+()-]*$/)) {
      setError(props.errorText);
    } else {
      setError('');
      setTextValue(e.target.value);
    }
  };

  const dialPadButtonsDefault: DialpadButtonsType[][] = [
    [
      { primaryContent: '1' },
      { primaryContent: '2', secondaryContent: 'ABC' },
      { primaryContent: '3', secondaryContent: 'DEF' }
    ],
    [
      { primaryContent: '4', secondaryContent: 'GHI' },
      { primaryContent: '5', secondaryContent: 'JKL' },
      { primaryContent: '6', secondaryContent: 'MNO' }
    ],
    [
      { primaryContent: '7', secondaryContent: 'PQRS' },
      { primaryContent: '8', secondaryContent: 'TUV' },
      { primaryContent: '9', secondaryContent: 'WXYZ' }
    ],
    [{ primaryContent: '*' }, { primaryContent: '0', secondaryContent: '+' }, { primaryContent: '#' }]
  ];

  return (
    <div className={mergeStyles(containerStyles(theme), props.styles?.root)}>
      <TextField
        styles={concatStyleSets(textFieldStyles(theme), props.styles?.textField)}
        value={formatPhoneNumber(textValue)}
        onChange={setText}
        errorMessage={error}
        placeholder={props.defaultText}
      />

      {props.dialpadButtons ??
        dialPadButtonsDefault.map((rows, i) => {
          return (
            <Stack horizontal key={`row_${i}`} style={{ alignItems: 'stretch' }}>
              {rows.map((button, i) => (
                <DialpadButton
                  key={`button_${i}`}
                  primaryContent={button.primaryContent}
                  secondaryContent={button.secondaryContent}
                  styles={props.styles}
                  onClick={onClickDialpad}
                />
              ))}
            </Stack>
          );
        })}
    </div>
  );
};
