// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IStyle, IButtonStyles, ITextFieldStyles, Icon } from '@fluentui/react';
import React from 'react';
/* @conditional-compile-remove(dialpad) */
import {
  concatStyleSets,
  DefaultButton,
  FocusZone,
  mergeStyles,
  Stack,
  Text,
  TextField,
  useTheme
} from '@fluentui/react';
/* @conditional-compile-remove(dialpad) */
import { _formatString } from '@internal/acs-ui-common';
/* @conditional-compile-remove(dialpad) */
import { useState } from 'react';
/* @conditional-compile-remove(dialpad) */
import { useLocale } from '../../localization';
/* @conditional-compile-remove(dialpad) */
import {
  buttonStyles,
  containerStyles,
  primaryContentStyles,
  secondaryContentStyles,
  textFieldStyles
} from '../styles/Dialpad.styles';
/* @conditional-compile-remove(dialpad) */
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
import { Backspace20Regular } from '@fluentui/react-icons';

/**
 * Strings of {@link Dialpad} that can be overridden.
 *
 * @beta
 */
export interface DialpadStrings {
  placeholderText: string;
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
  primaryContent?: IStyle;
  secondaryContent?: IStyle;
}

/**
 * Type for  {@link DialpadButton} input
 *
 * @beta
 */
export interface DialpadButtonProps {
  primaryContent: string;
  secondaryContent?: string;
}

/**
 * DTMF tone for PSTN calls.
 *
 * @beta
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
 * Props for {@link Dialpad} component.
 *
 * @beta
 */
export interface DialpadProps {
  strings?: DialpadStrings;
  // comment out the following prop for now to disable customization for dialpad content
  // dialpadButtons?: DialpadButtonProps[][];
  /**  function to send dtmf tones on button click */
  onSendDtmfTone?: (dtmfTone: DtmfTone) => Promise<void>;
  /**  Callback for dialpad button behavior*/
  onClickDialpadButton?: (buttonValue: string, buttonIndex: number) => void;
  /**  customize dialpad input formatting */
  onDisplayDialpadInput?: (input: string) => string;
  /**
   * custom function that takes unformatted dialpad input and return a modified input.
   * This function is called when clicking on delete button in textfield
   * Please provide this function if onDisplayDialpadInput is modified in a way that characters excluding numbers and +, *, # can be typed in the dialpad textfield
   * */
  returnModifiedDialpadInputOnClickDelete?: (input: string) => string;
  /**  on change function for text field */
  onChange?: (input: string) => void;
  styles?: DialpadStyles;
}

/* @conditional-compile-remove(dialpad) */
const DialpadButton = (props: {
  primaryContent: string;
  secondaryContent?: string;
  styles?: DialpadStyles;
  index: number;
  onClick: (input: string, index: number) => void;
}): JSX.Element => {
  const theme = useTheme();
  return (
    <DefaultButton
      data-test-id={`dialpad-button-${props.index}`}
      onClick={() => {
        props.onClick(props.primaryContent, props.index);
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

/* @conditional-compile-remove(dialpad) */
const dialPadButtonsDefault: DialpadButtonProps[][] = [
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

/* @conditional-compile-remove(dialpad) */
const DtmfTones: DtmfTone[] = [
  'Num1',
  'Num2',
  'Num3',
  'Num4',
  'Num5',
  'Num6',
  'Num7',
  'Num8',
  'Num9',
  'Star',
  'Num0',
  'Pound'
];

/* @conditional-compile-remove(dialpad) */
const DialpadContainer = (props: {
  placeholderText: string;
  // dialpadButtons?: DialpadButtonProps[][];
  onSendDtmfTone?: (dtmfTone: DtmfTone) => Promise<void>;
  /**  Callback for dialpad button behavior */
  onClickDialpadButton?: (buttonValue: string, buttonIndex: number) => void;
  /**  customize dialpad input formatting */
  onDisplayDialpadInput?: (input: string) => string;
  /**
   * custom function that takes unformatted dialpad input and return a modified input.
   * This function is called when clicking on delete button in textfield
   * Please provide this function if onDisplayDialpadInput is modified in a way that characters excluding numbers and +, *, # can be typed in the dialpad textfield
   * */
  returnModifiedDialpadInputOnClickDelete?: (input: string) => string;
  /**  on change function for text field */
  onChange?: (input: string) => void;
  styles?: DialpadStyles;
}): JSX.Element => {
  const theme = useTheme();
  const [textValue, setTextValue] = useState('');

  const {
    onSendDtmfTone,
    onClickDialpadButton,
    onDisplayDialpadInput,
    onChange,
    returnModifiedDialpadInputOnClickDelete
  } = props;

  const onClickDialpad = (input: string, index: number): void => {
    setTextValue(textValue + input);
    if (onSendDtmfTone) {
      onSendDtmfTone(DtmfTones[index]);
    }
    if (onClickDialpadButton) {
      onClickDialpadButton(input, index);
    }
    if (onChange) {
      onChange(onDisplayDialpadInput ? onDisplayDialpadInput(textValue + input) : formatPhoneNumber(textValue + input));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setText = (e: any): void => {
    setTextValue(e.target.value);
  };
  // comment out the following line for now to disable customization for dialpad content
  // const dialpadButtonsContent = props.dialpadButtons ?? dialPadButtonsDefault;

  const deleteNumbers = (): void => {
    if (returnModifiedDialpadInputOnClickDelete) {
      setTextValue(returnModifiedDialpadInputOnClickDelete(textValue));
    } else {
      setTextValue(textValue.replace(/[^\d*#+]/g, '').substring(0, textValue.replace(/[^\d*#+]/g, '').length - 1));
    }
  };

  return (
    <div className={mergeStyles(containerStyles(theme), props.styles?.root)} data-test-id="dialpadContainer">
      <TextField
        styles={concatStyleSets(textFieldStyles(theme), props.styles?.textField)}
        value={onDisplayDialpadInput ? onDisplayDialpadInput(textValue) : formatPhoneNumber(textValue)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => {
          setText(e);
          if (onChange) {
            onChange(onDisplayDialpadInput ? onDisplayDialpadInput(e.target.value) : formatPhoneNumber(e.target.value));
          }
        }}
        placeholder={props.placeholderText}
        data-test-id="dialpad-input"
        onRenderSuffix={(): JSX.Element => (
          <Backspace20Regular
            style={{ display: textValue.replace(/[^\d*#+]/g, '').length === 0 ? 'none' : 'block', cursor: 'pointer' }}
            onClick={deleteNumbers}
          />
        )}
      />
      <FocusZone>
        {dialPadButtonsDefault.map((rows, rowIndex) => {
          return (
            <Stack horizontal key={`row_${rowIndex}`} horizontalAlign="stretch">
              {rows.map((button, columnIndex) => (
                <DialpadButton
                  key={`button_${columnIndex}`}
                  /* row index = 0
                  columnIndex: (0,1,2) => (0,1,2)
                  row index = 1
                  columnIndex: (0,1,2)=> (3,4,5)
                  row index = 2
                  columnIndex: (0,1,2)=> (6,7,8)
                  row index = 3
                  columnIndex: (0,1,2)=> (9,10,11)
                  columnIndex + rowIndex*rows.length calculates the corresponding index for each button
                  dialpad index:
                  0 1 2
                  3 4 5
                  6 7 8
                  9 10 11
                  then use this index to locate the corresponding dtmf tones
                  DtmfTones[index]
                  */
                  index={columnIndex + rowIndex * rows.length}
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

/**
 * A component to allow users to enter phone number through clicking on dialpad/using keyboard
 * It will return empty component for stable builds
 *
 * @beta
 */
export const Dialpad = (props: DialpadProps): JSX.Element => {
  /* @conditional-compile-remove(dialpad) */
  const localeStrings = useLocale().strings.dialpad;
  /* @conditional-compile-remove(dialpad) */
  const strings = { ...localeStrings, ...props.strings };

  return (
    <>
      {
        /* @conditional-compile-remove(dialpad) */
        <DialpadContainer placeholderText={strings.placeholderText} {...props} />
      }
    </>
  );
};
