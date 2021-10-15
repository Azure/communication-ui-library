// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  FocusTrapZone,
  IStackItemStyles,
  IStackStyles,
  ITextFieldStyles,
  mergeStyles,
  Stack,
  TextField,
  useTheme
} from '@fluentui/react';
import React from 'react';

/**
 * @private
 */
export interface CursorCanvasBubbleProps {
  bubbleOwnerName: string;
  color: string;
  backgroundColor: string;
  text?: string;
  isEditing: boolean;
  onTextFieldChange?: (text: string) => void;
  onTextFieldEnterPressed: () => void;
}

/**
 * @private
 */
export const CursorCanvasBubble = (props: CursorCanvasBubbleProps): JSX.Element => {
  const showNameOnly = !(props.isEditing || props.text);
  const bubbleStyles: IStackStyles = {
    root: {
      minWidth: showNameOnly ? '10px' : '111px',
      background: props.backgroundColor,
      color: props.color,
      borderRadius: '2px 16px 16px 16px',
      paddingLeft: '10px',
      paddingRight: '10px',
      paddingTop: '8px',
      paddingBottom: '8px'
    }
  };
  const bubbleHeaderStyles: IStackItemStyles = {
    root: {
      color: props.color,
      opacity: showNameOnly ? 1 : 0.8,
      fontSize: showNameOnly ? '8px' : '8px',
      lineHeight: showNameOnly ? '16px' : '9px',
      paddingBottom: showNameOnly ? '0px' : '4px'
    }
  };
  const bubbleBodyStyles: IStackItemStyles = {
    root: {
      color: props.color,
      fontSize: '12px',
      lineHeight: '14px'
    }
  };
  const overwritingStyles = {
    color: `${props.color} !important`,
    border: 'none !important',
    fontSize: '12px !important',
    lineHeight: '18px !important',
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
  const bubbleBody = !props.isEditing ? (
    props.text
  ) : (
    <FocusTrapZone>
      <TextField
        value={props.text}
        styles={bubbleTextFieldWrapperStyles}
        inputClassName={bubbleTextFieldStyles}
        onChange={(e, newValue) => {
          props.onTextFieldChange && props.onTextFieldChange(newValue ?? '');
        }}
        onKeyPress={(ev) => {
          if (ev.key === 'Enter') {
            props.onTextFieldEnterPressed && props.onTextFieldEnterPressed();
          }
        }}
      />
    </FocusTrapZone>
  );

  return (
    <Stack styles={bubbleStyles}>
      <Stack.Item styles={bubbleHeaderStyles}>{bubbleHeader}</Stack.Item>
      {!showNameOnly && <Stack.Item styles={bubbleBodyStyles}>{bubbleBody}</Stack.Item>}
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
