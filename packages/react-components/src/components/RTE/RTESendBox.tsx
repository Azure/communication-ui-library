// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import React, { useState } from 'react';
import { RTEInputBoxComponent } from './RTEInputBoxComponent';
import { Stack, useTheme } from '@fluentui/react';
import { sendBoxStyle } from '../styles/RTESendBox.styles';
import { useLocale } from '../../localization';
import { SendBoxStrings } from '../SendBox';

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
  /**
   * Optional strings to override in component
   */
  strings?: Partial<SendBoxStrings>;
  /**
   * Optional text for system message below text box
   */
  systemMessage?: string;
}

/**
 * A component to render SendBox with Rich Text Editor support.
 *
 * @beta
 */
export const RTESendBox = (props: RTESendBoxProps): JSX.Element => {
  const { disabled, systemMessage } = props;

  const theme = useTheme();
  const localeStrings = useLocale().strings.sendBox;
  const strings = { ...localeStrings, ...props.strings };

  const [textValue] = useState('');

  const errorMessage = systemMessage;

  return (
    <Stack
      className={sendBoxStyle({
        theme: theme,
        hasErrorMessage: !!errorMessage,
        disabled: !!disabled
      })}
    >
      <RTEInputBoxComponent placeholderText={strings.placeholderText} textValue={textValue} />
      {/* Send Button */}
      {/* System Error Message */}
      {/* File Upload */}
    </Stack>
  );
};
