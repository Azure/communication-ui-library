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
 * DTMF tone for PSTN calls.
 *
 * @internal
 */
export type DtmfTone =
  | 'A'
  | 'B'
  | 'C'
  | 'D'
  | 'Flash'
  | 'Num0'
  | 'Num1'
  | 'Num2'
  | 'Num3'
  | 'Num4'
  | 'Num5'
  | 'Num6'
  | 'Num7'
  | 'Num8'
  | 'Num9'
  | 'Pound'
  | 'Star';

/**
 * Props for {@link _Dialpad} component.
 *
 * @internal
 */
export interface _DialpadProps {
  // strings are required for now since this is an internal component and strings are not localized yet
  strings: _DialpadStrings;
  // This prop is here so that contoso can define their own dialpad button content
  // when defining their own content, they will also need to pass in primaryContentToDtmfMapping, which maps the dialpad primary content to its corresponding dtmf tone
  // The issue is our sendDTMF only allows specific input 'A' | 'B' | 'C' | 'D' | 'Flash' | 'Num0' | 'Num1' | 'Num2' | 'Num3' | 'Num4' | 'Num5' | 'Num6' | 'Num7' | 'Num8' | 'Num9' | 'Pound' | 'Star';
  // contoso will need to pass in their own onSendDtmfTones as well
  dialpadButtons?: _DialpadButtonProps[][];
  // key value pairs that map each button content to its dtmf tone input
  primaryContentToDtmfMapping?: {};
  // function to send dtmf tones on button click
  onSendDtmfTones?: (dtmfTones: DtmfTone) => Promise<void>;
  // add extra functionalities to dialpad buttons
  onClickDialpadButton?: () => void;
  // customize dialpad input formatting
  onDisplayDialpadInput?: (input: string) => string;
  styles?: _DialpadStyles;
}

/**
 * A component to allow users to enter phone number through clicking on dialpad/using keyboard
 *
 *
 * @internal
 */
export const _Dialpad = (props: _DialpadProps): JSX.Element => {
  return <DialpadContainer defaultText={props.strings.defaultText} {...props} />;
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

const primaryContentToDtmf = {
  '0': 'Num0',
  '1': 'Num1',
  '2': 'Num2',
  '3': 'Num3',
  '4': 'Num4',
  '5': 'Num5',
  '6': 'Num6',
  '7': 'Num7',
  '8': 'Num8',
  '9': 'Num9',
  '*': 'Star',
  '#': 'Pound'
};

const DialpadContainer = (props: {
  defaultText: string;
  dialpadButtons?: _DialpadButtonProps[][];
  // key value pairs that map each button content to its dtmf tone input
  primaryContentToDtmfMapping?: {};
  onSendDtmfTones?: (dtmfTones: DtmfTone) => Promise<void>;
  // add extra functionalities to dialpad buttons
  onClickDialpadButton?: () => void;
  // customize dialpad input formatting
  onDisplayDialpadInput?: (input: string) => string;
  styles?: _DialpadStyles;
}): JSX.Element => {
  const theme = useTheme();
  const [textValue, setTextValue] = useState('');
  const [error, setError] = useState('');

  const { onSendDtmfTones, primaryContentToDtmfMapping, onClickDialpadButton, onDisplayDialpadInput } = props;

  const onClickDialpad = (input: string): void => {
    setError('');
    setTextValue(textValue + input);
    if (onSendDtmfTones) {
      onSendDtmfTones(primaryContentToDtmfMapping ? primaryContentToDtmfMapping[input] : primaryContentToDtmf[input]);
    }
    if (onClickDialpadButton) {
      onClickDialpadButton();
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setText = (e: any): void => {
    setError('');
    setTextValue(e.target.value);
  };

  const dialpadButtonsContent = props.dialpadButtons ?? dialPadButtonsDefault;

  return (
    <div className={mergeStyles(containerStyles(theme), props.styles?.root)}>
      <TextField
        styles={concatStyleSets(textFieldStyles(theme), props.styles?.textField)}
        value={onDisplayDialpadInput ? onDisplayDialpadInput(textValue) : formatPhoneNumber(textValue)}
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
