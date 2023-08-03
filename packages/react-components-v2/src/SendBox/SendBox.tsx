// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { Button, Input, Tooltip } from '@fluentui/react-components';

import { SendBoxProps } from './SendBox.types';
import { use_SendBoxStyles } from './SendBox.styles';
import { useLocale } from '../localization';
import { Send24Regular } from '@fluentui/react-icons';
import { useIdentifiers } from '../identifiers';

/**
 * Component for typing and sending messages.
 *
 * Supports sending typing notification when user starts entering text.
 * Supports an optional message below the text input field.
 *
 * @public
 */
export const SendBox: ForwardRefComponent<SendBoxProps> = React.forwardRef((props, ref) => {
  const styles = use_SendBoxStyles();
  const ids = useIdentifiers();
  const localeStrings = useLocale().strings.sendBox;
  // const strings = { /*...localeStrings, */ ...props.strings };

  return (
    <div className={styles.root}>
      {/* <SendBoxErrors {...sendBoxErrorsProps} /> */}
      <Input
        aria-label={localeStrings.sendButtonAriaLabel}
        className={styles.input}
        contentAfter={
          <Tooltip withArrow content={localeStrings.sendButtonAriaLabel} relationship="description">
            <Button appearance="transparent" icon={<Send24Regular />} />
          </Tooltip>
        }
        data-ui-id={ids.sendboxTextField}
        disabled={props.disabled}
        id="sendBox"
        placeholder={localeStrings.placeholderText}
        ref={ref}
      />
    </div>
  );
});

SendBox.displayName = 'SendBox';
