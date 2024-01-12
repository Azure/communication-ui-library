// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React from 'react';
import { RTEInputBoxComponent } from './RTEInputBoxComponent';
import { Stack, useTheme } from '@fluentui/react';
import { sendBoxStyle } from '../styles/RTESendBox.styles';

// Should we combine this with the SendBoxStrings interface in InputBoxComponent.tsx?
/**
 * @public
 */
export interface RTESendBoxStrings {
  /**
   * Placeholder text in SendBox when there is no user input
   */
  placeholderText: string;
}

/**
 * Props for {@link RTESendBox}.
 *
 * @beta
 */
export interface RTESendBoxProps {
  /**
   * Optional boolean to disable text box
   * @defaultValue false
   */
  disabled?: boolean;

  // just a value to be displayed for now but it should be deleted when the component development starts
  valueToDisplay?: string;
}

/**
 * A component to render SendBox with Rich Text Editor support.
 *
 * @beta
 */
export const RTESendBox = (props: RTESendBoxProps): JSX.Element => {
  const { disabled, valueToDisplay = 'Enter a message' } = props;

  const theme = useTheme();
  const errorMessage = ''; // TODO: add error message

  return (
    <Stack
      className={sendBoxStyle({
        theme: theme,
        hasErrorMessage: !!errorMessage,
        disabled: !!disabled
      })}
    >
      <RTEInputBoxComponent textValue={valueToDisplay} />
    </Stack>
  );
};
