// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IStackItemStyles,
  IStackStyles,
  ITextFieldStyles,
  mergeStyles,
  Stack,
  TextField,
  useTheme
} from '@fluentui/react';
import React, { useRef } from 'react';

/**
 * @private
 */
export interface CursorCanvasBubbleProps {
  bubbleOwnerName: string;
  color: string;
  onEditingFinished: (text: string) => void;
  text?: string;
}

/**
 * @private
 */
export const CursorCanvasBubble = (props: CursorCanvasBubbleProps): JSX.Element => {
  const palette = useTheme().palette;
  const editedText = useRef<string>();
  const bubbleStyles: IStackStyles = {
    root: {
      minWidth: '111px',
      height: '30px',
      background: props.color,
      borderRadius: '2px 10px 10px 10px',
      paddingLeft: '4px',
      paddingRight: '4px',
      paddingTop: '2px',
      paddingBottom: '2px'
    }
  };
  const bubbleHeaderStyles: IStackItemStyles = {
    root: {
      color: `${palette.white}`,
      opacity: 0.6,
      fontSize: '8px',
      lineHeight: '9px'
    }
  };
  const bubbleBodyStyles: IStackItemStyles = {
    root: {
      color: `${palette.white}`,
      fontSize: '10px',
      lineHeight: '14px'
    }
  };
  const overwritingStyles = {
    color: `${palette.white} !important`,
    fontSize: '10px !important',
    lineHeight: '14px !important',
    border: 'none !important',
    background: 'none !important',
    padding: 'none !important',
    height: 'unset !important',
    margin: 'none !important',
    ':before': {
      margin: 'none !important',
      border: 'none !important',
      padding: 'none !important'
    },
    ':after': {
      margin: 'none !important',
      border: 'none !important',
      padding: 'none !important'
    }
  };
  const bubbleTextFieldWrapperStyles: Partial<ITextFieldStyles> = {
    field: { ...overwritingStyles },
    fieldGroup: { ...overwritingStyles },
    root: { ...overwritingStyles },
    wrapper: { ...overwritingStyles }
  };
  const bubbleTextFieldStyles = mergeStyles({
    ...overwritingStyles
  });

  const bubbleHeader = props.bubbleOwnerName;
  const bubbleBody = props.text ? (
    props.text
  ) : (
    <TextField
      styles={bubbleTextFieldWrapperStyles}
      inputClassName={bubbleTextFieldStyles}
      onChange={(e, newValue) => {
        editedText.current = newValue;
      }}
      onKeyPress={(ev) => {
        if (ev.key === 'Enter') {
          console.log(editedText.current);
          editedText.current && props.onEditingFinished(editedText.current);
        }
      }}
    />
  );

  return (
    <Stack styles={bubbleStyles}>
      <Stack.Item styles={bubbleHeaderStyles}>{bubbleHeader}</Stack.Item>
      <Stack.Item styles={bubbleBodyStyles}>{bubbleBody}</Stack.Item>
    </Stack>
  );
};

/*
<textarea
      ref={textArea}
      className={mergeStyles({ root: overwritingStyles })}
      onKeyPress={(ev) => {
        if (!textArea.current) return;
        console.log(textArea.current.textContent);
        if (ev.key === 'Enter') {
          textArea.current.textContent && props.onEditingFinished(textArea.current.textContent);
        }
      }}
    />
*/
