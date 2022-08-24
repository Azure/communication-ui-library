// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
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
  primaryContentStyles,
  secondaryContentStyles,
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
  primaryContent?: IStyle;
  secondaryContent?: IStyle;
  deleteIcon?: IButtonStyles;
}

/**
 * Props for {@link Dialpad} component.
 *
 * @beta
 */
export interface DialpadProps {
  strings?: DialpadStrings;
  // Potential Improvement:
  // comment out the following prop for now to disable customization for dialpad content
  // dialpadButtons?: DialpadButtonProps[][];
  /**  function to send dtmf tones on button click */
  onSendDtmfTone?: (dtmfTone: DtmfTone) => Promise<void>;
  /**  Callback for dialpad button behavior*/
  onClickDialpadButton?: (buttonValue: string, buttonIndex: number) => void;
  /**  customize dialpad input formatting */
  onDisplayDialpadInput?: (input: string) => string;
  /**  on change function for text field */
  onChange?: (input: string) => void;
  /**  boolean input to determine when to show/hide delete button, default true */
  showDeleteButton?: boolean;
  styles?: DialpadStyles;
}

/**
 * Type for  {@link DialpadButton} input
 *
 * @internal
 */
export interface DialpadButtonProps {
  /** Number displayed on each dialpad button */
  primaryContent: string;
  /** Letters displayed on each dialpad button */
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
  primaryContent: string;
  secondaryContent?: string;
  styles?: DialpadStyles;
  index: number;
  onClick: (input: string, index: number) => void;
  onLongPress: (input: string, index: number) => void;
}): JSX.Element => {
  const theme = useTheme();
  const clickFunction = () => {
    props.onClick(props.primaryContent, props.index);
  };
  const longPressFunction = () => {
    props.onLongPress(props.primaryContent, props.index);
  };

  const { handlers } = useLongPress(clickFunction, longPressFunction);
  return (
    <DefaultButton
      data-test-id={`dialpad-button-${props.index}`}
      styles={concatStyleSets(buttonStyles(theme), props.styles?.button)}
      {...handlers}
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

const DialpadContainer = (props: {
  strings: DialpadStrings;
  // dialpadButtons?: DialpadButtonProps[][];
  onSendDtmfTone?: (dtmfTone: DtmfTone) => Promise<void>;
  /**  Callback for dialpad button behavior */
  onClickDialpadButton?: (buttonValue: string, buttonIndex: number) => void;
  /**  customize dialpad input formatting */
  onDisplayDialpadInput?: (input: string) => string;
  /**  on change function for text field */
  onChange?: (input: string) => void;
  /**  boolean input to determine when to show/hide delete button, default true */
  showDeleteButton?: boolean;
  styles?: DialpadStyles;
}): JSX.Element => {
  const theme = useTheme();
  const [textValue, setTextValue] = useState('');

  const { onSendDtmfTone, onClickDialpadButton, onDisplayDialpadInput, onChange, showDeleteButton = true } = props;

  const sanitizeInput = (input: string): string => {
    // remove non-valid characters from input: letters,special characters excluding +, *,#
    return input.replace(/[^\d*#+]/g, '');
  };

  const onClickDialpad = (input: string, index: number): void => {
    // remove non-valid characters from input: letters,special characters excluding +, *,#
    const value = sanitizeInput(textValue + input);
    setTextValue(value);
    if (onSendDtmfTone) {
      onSendDtmfTone(DtmfTones[index]);
    }
    if (onClickDialpadButton) {
      onClickDialpadButton(input, index);
    }
    if (onChange) {
      onChange(onDisplayDialpadInput ? onDisplayDialpadInput(value) : formatPhoneNumber(value));
    }
  };

  const onLongPressDialpad = (input: string, index: number): void => {
    let value;
    if (input === '0' && index === 10) {
      // remove non-valid characters from input: letters,special characters excluding +, *,#
      value = sanitizeInput(textValue + '+');
      setTextValue(value);
    } else {
      value = sanitizeInput(textValue + input);
      setTextValue(value);
    }
    if (onSendDtmfTone) {
      onSendDtmfTone(DtmfTones[index]);
    }
    if (onClickDialpadButton) {
      onClickDialpadButton(input, index);
    }
    if (onChange) {
      onChange(onDisplayDialpadInput ? onDisplayDialpadInput(value) : formatPhoneNumber(value));
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setText = (e: any): void => {
    // remove non-valid characters from input: letters,special characters excluding +, *,#
    const input = sanitizeInput(e.target.value);
    setTextValue(input);
  };

  // Potential Improvement:
  // comment out the following line for now to disable customization for dialpad content
  // const dialpadButtonsContent = props.dialpadButtons ?? dialPadButtonsDefault;

  const deleteNumbers = (): void => {
    const modifiedInput = textValue.substring(0, textValue.length - 1);
    setTextValue(modifiedInput);
    if (onChange) {
      onChange(onDisplayDialpadInput ? onDisplayDialpadInput(modifiedInput) : formatPhoneNumber(modifiedInput));
    }
  };

  return (
    <div
      className={mergeStyles(containerStyles(theme), props.styles?.root)}
      data-test-id="dialpadContainer"
      data-ui-id="dialpadContainer"
    >
      <TextField
        styles={concatStyleSets(textFieldStyles(theme), props.styles?.textField)}
        value={onDisplayDialpadInput ? onDisplayDialpadInput(textValue) : formatPhoneNumber(textValue)}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(e: any) => {
          setText(e);
          // remove non-valid characters from input: letters,special characters excluding +, *,#
          const input = sanitizeInput(e.target.value);
          if (onChange) {
            onChange(onDisplayDialpadInput ? onDisplayDialpadInput(input) : formatPhoneNumber(input));
          }
        }}
        placeholder={props.strings.placeholderText}
        data-test-id="dialpad-input"
        onRenderSuffix={(): JSX.Element => (
          <>
            {showDeleteButton && textValue.length !== 0 && (
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
                  primaryContent={button.primaryContent}
                  secondaryContent={button.secondaryContent}
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
