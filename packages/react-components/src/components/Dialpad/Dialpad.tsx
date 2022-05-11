// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  concatStyleSets,
  DefaultButton,
  FocusZone,
  IButtonStyles,
  IStyle,
  ITextFieldStyles,
  mergeStyles,
  Stack,
  Text,
  TextField,
  useTheme
} from '@fluentui/react';
import { _formatString } from '@internal/acs-ui-common';
import React, { useState } from 'react';
import { useLocale } from '../../localization';
import {
  buttonStyles,
  containerStyles,
  primaryContentStyles,
  secondaryContentStyles,
  textFieldStyles
} from '../styles/Dialpad.styles';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';

/**
 * Strings of {@link _Dialpad} that can be overridden.
 *
 * @internal
 */
export interface _DialpadStrings {
  errorText: string;
  defaultText: string;
}

/**
 * Styles for {@link _Dialpad} component.
 *
 * @internal
 */
export interface _DialpadStyles {
  root?: IStyle;
  button?: IButtonStyles;
  textField?: Partial<ITextFieldStyles>;
  primaryContent?: IStyle;
  secondaryContent?: IStyle;
}

/**
 * Type for  {@link _DialpadButton} input
 *
 * @internal
 */
export interface _DialpadButtonProps {
  primaryContent: string;
  secondaryContent?: string;
}

/**
 * Props for {@link _Dialpad} component.
 *
 * @internal
 */
export interface _DialpadProps {
  strings?: _DialpadStrings;
  dialpadButtons?: _DialpadButtonProps[][];
  styles?: _DialpadStyles;
}

/**
 * A component to allow users to enter phone number through clicking on dialpad/using keyboard
 *
 *
 * @internal
 */
export const _Dialpad = (props: _DialpadProps): JSX.Element => {
  const localeStrings = useLocale().strings.dialpad;
  const strings = { ...localeStrings, ...props.strings };
  return <DialpadContainer errorText={strings.errorText} defaultText={strings.defaultText} {...props} />;
};

const DialpadButton = (props: {
  primaryContent: string;
  secondaryContent?: string;
  styles?: _DialpadStyles;
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
        <Text className={mergeStyles(primaryContentStyles(theme), props.styles?.primaryContent)}>
          {props.primaryContent}
        </Text>

        <Text className={mergeStyles(secondaryContentStyles(theme), props.styles?.secondaryContent)}>
          {props.secondaryContent ?? ' '}
        </Text>
      </Stack>
    </DefaultButton>
  );
};

const dialPadButtonsDefault: _DialpadButtonProps[][] = [
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

const DialpadContainer = (props: {
  errorText: string;
  defaultText: string;
  dialpadButtons?: _DialpadButtonProps[][];
  styles?: _DialpadStyles;
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
      setError(
        _formatString(props.errorText, { invalidCharacter: `${e.target.value.slice(e.target.value.length - 1)}` })
      );
    } else {
      setError('');
      setTextValue(e.target.value);
    }
  };

  const dialpadButtonsContent = props.dialpadButtons ?? dialPadButtonsDefault;

  return (
    <div className={mergeStyles(containerStyles(theme), props.styles?.root)}>
      <TextField
        styles={concatStyleSets(textFieldStyles(theme), props.styles?.textField)}
        value={formatPhoneNumber(textValue)}
        onChange={setText}
        errorMessage={error}
        placeholder={props.defaultText}
      />
      <FocusZone>
        {dialpadButtonsContent.map((rows, i) => {
          return (
            <Stack horizontal key={`row_${i}`} horizontalAlign="stretch">
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
      </FocusZone>
    </div>
  );
};
