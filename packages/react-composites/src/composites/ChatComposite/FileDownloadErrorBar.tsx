// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageBar, MessageBarType, Stack } from '@fluentui/react';
import React from 'react';

/**
 * @private
 */
export interface FileDownloadErrorBarProps {
  /**callback to dismiss the download error message */
  onDismissDownloadErrorMessage: () => void;
  /** Error message to render */
  fileDownloadErrorMessage: string;
}

/**
 * @private
 */
export const FileDownloadErrorBar = (props: FileDownloadErrorBarProps): JSX.Element => {
  const { fileDownloadErrorMessage, onDismissDownloadErrorMessage } = props;
  const messageBarIconProps = { iconName: 'ProtectedDocument' };

  if (fileDownloadErrorMessage !== '') {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <MessageBar
          messageBarType={MessageBarType.warning}
          onDismiss={() => {
            onDismissDownloadErrorMessage();
          }}
          messageBarIconProps={messageBarIconProps}
        >
          {fileDownloadErrorMessage}
        </MessageBar>
      </Stack>
    );
  } else {
    return <></>;
  }
};
