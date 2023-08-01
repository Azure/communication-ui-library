// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';

import { SendBoxProps } from './SendBox.types';
import { useSendBoxStyles } from './SendBox.styles';

/**
 * Component for typing and sending messages.
 *
 * Supports sending typing notification when user starts entering text.
 * Supports an optional message below the text input field.
 *
 * @public
 */
export const SendBox: ForwardRefComponent<SendBoxProps> = React.forwardRef((props, ref) => {
  const className = useSendBoxStyles(props);

  // const localeStrings = useLocale().strings.sendBox;
  const strings = { /*...localeStrings, */ ...props.strings };

  return (
    <div {...props} className={className} ref={ref}>
      SendBox v2 Component
    </div>
  );
});

SendBox.displayName = 'SendBox';
