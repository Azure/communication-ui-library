// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useEffect, useRef } from 'react';
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
import { useLocale } from '../../localization';
import {
  buttonStyles,
  containerStyles,
  iconButtonStyles,
  digitStyles,
  letterStyles,
  textFieldStyles
} from '../styles/Dialpad.styles';
import { _formatPhoneNumber } from '../utils/formatPhoneNumber';
import useLongPress from '../utils/useLongPress';

import { dtmfFrequencies, DtmfFrequenciesKeys, Tone } from './DTMFToneGenerator';

/**
 * Strings of {@link Dialpad} that can be overridden.
 *
 * @public
 */
export interface DialpadStrings {
  placeholderText: string;
  deleteButtonAriaLabel?: string;
}

/**
 * Styles for {@link Dialpad} component.
 *
 * @public
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
 * @public
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
 * Modes of the dialpad component.
 * @public
 */
export type DialpadMode = 'dtmf' | 'dialer';

/**
 * Modes of how the longpress handlers can be tiggered.
 * @public
 */
export type LongPressTrigger = 'mouseAndTouch' | 'touch';

/**
 * Props for {@link Dialpad} component.
 *
 * @public
 */
export interface DialpadProps {
  strings?: DialpadStrings;
  /**
   * function to send dtmf tones on button click
   */
  onSendDtmfTone?: (dtmfTone: DtmfTone) => Promise<void>;
  /**
   * Callback for dialpad button behavior
   */
  onClickDialpadButton?: (buttonValue: string, buttonIndex: number) => void;
  /**
   * set dialpad textfield content
   */
  textFieldValue?: string;
  /**
   * on change function for text field, provides an unformatted plain text
   */
  onChange?: (input: string) => void;
  /**
   * flag to determine when to show/hide delete button, default true
   */
  showDeleteButton?: boolean;
  /**
   * Determines what kind of device that the user is on and should respect that based on interaction
   * interfaces available to the user
   */
  longPressTrigger?: LongPressTrigger;
  /**
   * Styles for customizing the dialpad component
   */
  styles?: DialpadStyles;
  /**
   * Disables DTMF sounds when dialpad buttons are pressed. the actual
   * tones are still sent to the call.
   */
  disableDtmfPlayback?: boolean;
  /**
   * Dialer mode for the dialpad. The dtmf mode is for sending dtmf tones and the appearence of
   * the dialpad is changed like hiding the input box. When using dialer mode the input box is there
   * and can be edited to change the number being dialed.
   */
  dialpadMode?: DialpadMode;
  /**
   * Audio context for generating DTMF tones. If this if not provided the dialpad will create one iteslf.
   */
  dtmfAudioContext?: AudioContext;
}

type DialpadButtonContent = {
  /** Number displayed on each dialpad button */
  digit: DtmfFrequenciesKeys;
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
  digit: DtmfFrequenciesKeys;
  letter?: string;
  styles?: DialpadStyles;
  index: number;
  onClick: (input: string, index: number) => void;
  onLongPress: (input: string, index: number) => void;
  longPressTrigger: LongPressTrigger;
  dtmfToneAudioContext: AudioContext;
  disableDtmfPlayback?: boolean;
}): JSX.Element => {
  const theme = useTheme();

  const { digit, index, onClick, onLongPress, longPressTrigger, dtmfToneAudioContext, disableDtmfPlayback } = props;
  const [buttonPressed, setButtonPressed] = useState(false);

  const dtmfToneSound = useRef<Tone>(
    new Tone(dtmfToneAudioContext, dtmfFrequencies[digit].f1, dtmfFrequencies[digit].f2)
  );

  const useLongPressProps = React.useMemo(
    () => ({
      onClick: async () => {
        onClick(digit, index);
      },
      onLongPress: async () => {
        onLongPress(digit, index);
      },
      touchEventsOnly: longPressTrigger === 'touch'
    }),
    [digit, index, longPressTrigger, onClick, onLongPress]
  );

  const longPressHandlers = useLongPress(useLongPressProps);

  return (
    <DefaultButton
      data-test-id={`dialpad-button-${props.index}`}
      styles={concatStyleSets(buttonStyles(theme), props.styles?.button)}
      {...longPressHandlers}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !buttonPressed) {
          if (!disableDtmfPlayback) {
            dtmfToneSound.current.play();
          }
          longPressHandlers.onKeyDown();
          setButtonPressed(true);
          return;
        }
        if (
          e.key === 'Tab' ||
          e.key === 'ArrowLeft' ||
          e.key === 'ArrowRight' ||
          e.key === 'ArrowUp' ||
          e.key === 'ArrowDown'
        ) {
          dtmfToneSound.current.stop();
          return;
        }
        longPressHandlers.onKeyDown();
      }}
      onKeyUp={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && buttonPressed) {
          dtmfToneSound.current.stop();
          longPressHandlers.onKeyUp();
          setButtonPressed(false);
        }
        longPressHandlers.onKeyUp();
      }}
      onMouseDown={() => {
        if (!disableDtmfPlayback) {
          dtmfToneSound.current.play();
        }
        longPressHandlers.onMouseDown();
      }}
      onMouseUp={() => {
        dtmfToneSound.current.stop();
        longPressHandlers.onMouseUp();
      }}
      onMouseLeave={() => {
        dtmfToneSound.current.stop();
      }}
      onTouchStart={() => {
        if (!disableDtmfPlayback) {
          dtmfToneSound.current.play();
        }
        longPressHandlers.onTouchStart();
      }}
      onTouchEnd={() => {
        dtmfToneSound.current.stop();
        longPressHandlers.onTouchEnd();
      }}
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
  /**  boolean input to determine if dialpad is in mobile view, default false */
  longPressTrigger?: LongPressTrigger;
  styles?: DialpadStyles;
  disableDtmfPlayback?: boolean;
  dialpadMode?: DialpadMode;
  dtmfAudioContext?: AudioContext;
}): JSX.Element => {
  const theme = useTheme();

  const {
    onSendDtmfTone,
    onClickDialpadButton,
    textFieldValue,
    onChange,
    showDeleteButton = true,
    longPressTrigger = 'mouseAndTouch',
    disableDtmfPlayback,
    dialpadMode = 'dialer',
    dtmfAudioContext
  } = props;

  const dtmfToneAudioContext = useRef(dtmfAudioContext ? dtmfAudioContext : new AudioContext());

  const [plainTextValue, setPlainTextValue] = useState(textFieldValue ?? '');
  const plainTextValuePreviousRenderValue = useRef(plainTextValue);

  useEffect(() => {
    if (plainTextValuePreviousRenderValue.current !== plainTextValue) {
      onChange?.(plainTextValue);
    }
    plainTextValuePreviousRenderValue.current = plainTextValue;
  }, [plainTextValuePreviousRenderValue, plainTextValue, onChange]);

  useEffect(() => {
    setText(textFieldValue ?? '');
  }, [textFieldValue]);

  const onClickDialpad = (input: string, index: number): void => {
    setText(plainTextValue + input);
    const tone = DtmfTones[index];
    if (onSendDtmfTone && tone) {
      onSendDtmfTone(tone);
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
    const tone = DtmfTones[index];
    if (onSendDtmfTone && tone) {
      onSendDtmfTone(tone);
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
    <Stack
      className={mergeStyles(containerStyles(theme), props.styles?.root)}
      data-test-id="dialpadContainer"
      data-ui-id="dialpadContainer"
      horizontalAlign={'center'}
    >
      {dialpadMode === 'dialer' && (
        <TextField
          styles={concatStyleSets(textFieldStyles(theme, plainTextValue !== ''), props.styles?.textField)}
          value={textFieldValue ? textFieldValue : _formatPhoneNumber(plainTextValue)}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onChange={(e: any) => {
            setText(e.target.value);
          }}
          onClick={(e) => {
            e.preventDefault();
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
                  iconProps={{ iconName: 'DialpadBackspace' }}
                />
              )}
            </>
          )}
        />
      )}
      <FocusZone>
        {dialPadButtonsDefault.map((rows, rowIndex) => {
          return (
            <Stack horizontal key={`row_${rowIndex}`} horizontalAlign="stretch" tokens={{ childrenGap: '1rem' }}>
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
                  longPressTrigger={longPressTrigger}
                  dtmfToneAudioContext={dtmfToneAudioContext.current}
                  disableDtmfPlayback={disableDtmfPlayback}
                />
              ))}
            </Stack>
          );
        })}
      </FocusZone>
    </Stack>
  );
};

/**
 * A component to allow users to enter phone number through clicking on dialpad/using keyboard
 * It will return empty component for stable builds
 *
 * @public
 */
export const Dialpad = (props: DialpadProps): JSX.Element => {
  const localeStrings = useLocale().strings.dialpad;

  const strings = { ...localeStrings, ...props.strings };
  return <DialpadContainer strings={strings} {...props} />;
};

const sanitizeInput = (input: string): string => {
  // remove non-valid characters from input: letters,special characters excluding +, *,#
  return input.replace(/[^\d*#+]/g, '');
};
