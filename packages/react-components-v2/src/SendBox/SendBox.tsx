// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useMemo } from 'react';
import type { ForwardRefComponent } from '@fluentui/react-utilities';
import { Button, Input, Tooltip } from '@fluentui/react-components';

import { SendBoxProps } from './SendBox.types';
import { use_SendBoxStyles } from './SendBox.styles';
import { useLocale } from '../localization';
import { Send24Regular } from '@fluentui/react-icons';
import { useIdentifiers } from '../identifiers';
import { _SendBoxErrors } from './SendBoxErrors';

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
  const { activeFileUploads } = props;
  // const strings = { /*...localeStrings, */ ...props.strings };
  const [fileUploadsPendingError, setFileUploadsPendingError] = useState<SendBoxErrorBarError | undefined>(undefined);

  // Ensure that errors are cleared when there are no files in sendBox
  React.useEffect(() => {
    if (!activeFileUploads?.filter((upload) => !upload.error).length) {
      setFileUploadsPendingError(undefined);
    }
  }, [activeFileUploads]);

  const sendBoxErrorsProps = useMemo(() => {
    return {
      fileUploadsPendingError: fileUploadsPendingError,
      fileUploadError: activeFileUploads?.filter((fileUpload) => fileUpload.error).pop()?.error
    };
  }, [activeFileUploads, fileUploadsPendingError]);

  return (
    <div className={styles.root}>
      <_SendBoxErrors {...sendBoxErrorsProps} />
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
