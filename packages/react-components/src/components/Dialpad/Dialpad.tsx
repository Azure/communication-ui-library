// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect, useCallback } from 'react';
import { IStyle, IButtonStyles, ITextFieldStyles } from '@fluentui/react';

import { IconButton } from '@fluentui/react';
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
import { _formatString } from '@internal/acs-ui-common';
import { useState } from 'react';
/* @conditional-compile-remove(dialpad) */
import { useLocale } from '../../localization';
import {
  buttonStyles,
  containerStyles,
  iconButtonStyles,
  digitStyles,
  letterStyles,
  textFieldStyles
} from '../styles/Dialpad.styles';
import { formatPhoneNumber } from '../utils/formatPhoneNumber';
import useLongPress from '../utils/useLongPress';

/**
 * Strings of {@link Dialpad} that can be overridden.
 *
 * @beta
 */
export interface DialpadStrings {
  placeholderText: string;
  deleteButtonAriaLabel?: string;
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
  letter?: IStyle;
  deleteIcon?: IButtonStyles;
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
  /**  function to send dtmf tones on button click */
  onSendDtmfTone?: (dtmfTone: DtmfTone) => Promise<void>;
  /**  Callback for dialpad button behavior*/
  onClickDialpadButton?: (buttonValue: string, buttonIndex: number) => void;
  /** set dialpad textfield content */
  textFieldValue?: string;
  /**  on change function for text field, provides an unformatted plain text*/
  onChange?: (input: string) => void;
  /**  boolean input to determine when to show/hide delete button, default true */
  showDeleteButton?: boolean;
  styles?: DialpadStyles;
}

type DialpadButtonContent = {
  /** Number displayed on each dialpad button */
  digit: string;
  /** Letters displayed on each dialpad button */
  letter?: string;
};

const dialPadButtonsDefault: DialpadButtonContent[][] = [
  [{ digit: '1' }, { digit: '2', letter: 'ABC' }, { digit: '3', letter: 'DEF' }],
  [
    { digit: '4', letter: 'GHI' },
    { digit: '5', letter: 'JKL' },
    { digit: '6', letter: 'MNO' }
  ],
  [
    { digit: '7', letter: 'PQRS' },
    { digit: '8', letter: 'TUV' },
    { digit: '9', letter: 'WXYZ' }
  ],
  [{ digit: '*' }, { digit: '0', letter: '+' }, { digit: '#' }]
];

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

const DialpadButton = (props: {
  digit: string;
  letter?: string;
  styles?: DialpadStyles;
  index: number;
  onClick: (input: string, index: number) => void;
  onLongPress: (input: string, index: number) => void;
}): JSX.Element => {
  const theme = useTheme();

  const { digit, index, onClick, onLongPress } = props;

  const clickFunction = useCallback(async () => {
    onClick(digit, index);
  }, [digit, index, onClick]);

  const longPressFunction = useCallback(async () => {
    onLongPress(digit, index);
  }, [digit, index, onLongPress]);

  const { handlers } = useLongPress(clickFunction, longPressFunction);
  return (
    <DefaultButton
      data-test-id={`dialpad-button-${props.index}`}
      styles={concatStyleSets(buttonStyles(theme), props.styles?.button)}
      {...handlers}
    >
      <Stack>
        <Text className={mergeStyles(digitStyles(theme), props.styles?.digit)}>{props.digit}</Text>

        <Text className={mergeStyles(letterStyles(theme), props.styles?.letter)}>{props.letter ?? ' '}</Text>
      </Stack>
    </DefaultButton>
  );
};

const DialpadContainer = (props: {
  strings: DialpadStrings;
  onSendDtmfTone?: (dtmfTone: DtmfTone) => Promise<void>;
  /**  Callback for dialpad button behavior */
  onClickDialpadButton?: (buttonValue: string, buttonIndex: number) => void;
  /** Pass in custom content to dialpad textfield */
  textFieldValue?: string;
  /**  on change function for text field, provides an unformatted plain text */
  onChange?: (input: string) => void;
  /**  boolean input to determine when to show/hide delete button, default true */
  showDeleteButton?: boolean;
  styles?: DialpadStyles;
}): JSX.Element => {
  const theme = useTheme();

  const { onSendDtmfTone, onClickDialpadButton, textFieldValue, onChange, showDeleteButton = true } = props;

  const [plainTextValue, setPlainTextValue] = useState(textFieldValue ?? '');

  useEffect(() => {
    if (onChange) {
      onChange(plainTextValue);
    }
  }, [plainTextValue, onChange]);

  useEffect(() => {
    setText(textFieldValue ?? '');
  }, [textFieldValue]);

  const onClickDialpad = (input: string, index: number): void => {
    setText(plainTextValue + input);
    if (onSendDtmfTone) {
      onSendDtmfTone(DtmfTones[index]);
    }
    if (onClickDialpadButton) {
      onClickDialpadButton(input, index);
    }
  };

  const onLongPressDialpad = (input: string, index: number): void => {
    if (input === '0' && index === 10) {
      setText(plainTextValue + '+');
    } else {
      setText(plainTextValue + input);
    }
    if (onSendDtmfTone) {
      onSendDtmfTone(DtmfTones[index]);
    }
    if (onClickDialpadButton) {
      onClickDialpadButton(input, index);
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setText = (input: string): void => {
    // remove non-valid characters from input: letters,special characters excluding +, *,#
    const plainInput = sanitizeInput(input);
    setPlainTextValue(plainInput);
  };

  const deleteNumbers = (): void => {
    const modifiedInput = plainTextValue.substring(0, plainTextValue.length - 1);
    setText(modifiedInput);
  };

  return (
    <div
      className={mergeStyles(containerStyles(theme), props.styles?.root)}
      data-test-id="dialpadContainer"
      data-ui-id="dialpadContainer"
    >
      <TextField
        styles={concatStyleSets(textFieldStyles(theme), props.styles?.textField)}
        value={textFieldValue ? textFieldValue : formatPhoneNumber(plainTextValue)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => {
          setText(e.target.value);
        }}
        placeholder={props.strings.placeholderText}
        data-test-id="dialpad-input"
        onRenderSuffix={(): JSX.Element => (
          <>
            {showDeleteButton && plainTextValue.length !== 0 && (
              <IconButton
                ariaLabel={props.strings.deleteButtonAriaLabel}
                onClick={deleteNumbers}
                styles={concatStyleSets(iconButtonStyles(theme), props.styles?.deleteIcon)}
                iconProps={{ iconName: 'BackSpace' }}
              />
            )}
          </>
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
                  digit={button.digit}
                  letter={button.letter}
                  styles={props.styles}
                  onClick={onClickDialpad}
                  onLongPress={onLongPressDialpad}
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
  /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
  const localeStrings = useLocale().strings.dialpad;

  const dialpadLocaleStringsTrampoline = (): DialpadStrings => {
    /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
    return localeStrings;
    // Even though the component strings type doesn't have `DialpadStrings` in stable build,
    // the string values exist. So unsafe cast for stable build.
    return '' as unknown as DialpadStrings;
  };
  const strings = { ...dialpadLocaleStringsTrampoline(), ...props.strings };

  return <DialpadContainer strings={strings} {...props} />;
};

const sanitizeInput = (input: string): string => {
  // remove non-valid characters from input: letters,special characters excluding +, *,#
  return input.replace(/[^\d*#+]/g, '');
};
