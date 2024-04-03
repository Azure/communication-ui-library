// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { MessageBar, MessageBarType, Stack } from '@fluentui/react';
import React from 'react';

/**
 * @private
 */
export interface AttachmentDownloadErrorBarProps {
  /**callback to dismiss the download error message */
  onDismissDownloadErrorMessage: () => void;
  /** Error message to render */
  attachmentDownloadErrorMessage: string;
}

/**
 * @private
 */
export const AttachmentDownloadErrorBar = (props: AttachmentDownloadErrorBarProps): JSX.Element => {
  const { attachmentDownloadErrorMessage, onDismissDownloadErrorMessage } = props;
  const messageBarIconProps = { iconName: 'ProtectedDocument' };

  if (attachmentDownloadErrorMessage !== '') {
    return (
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <MessageBar
          messageBarType={MessageBarType.warning}
          onDismiss={() => {
            onDismissDownloadErrorMessage();
          }}
          messageBarIconProps={messageBarIconProps}
        >
          {attachmentDownloadErrorMessage}
        </MessageBar>
      </Stack>
    );
  } else {
    return <></>;
  }
};
