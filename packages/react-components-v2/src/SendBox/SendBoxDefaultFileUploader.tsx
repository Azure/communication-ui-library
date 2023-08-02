// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';

import { ForwardRefComponent } from '@fluentui/react-utilities';
import { _DefaultFileUploaderProps } from './SendBoxDefaultFileUploader.types';

/**
 * Provides the default file uploader for the send box.
 *
 * @returns default file uploader
 * @internal
 */
export const _SendBoxDefaultFileUploader: ForwardRefComponent<_DefaultFileUploaderProps> = React.forwardRef(
  (props, ref) => {
    // const { activeFileUploads } = props;

    return (
      <div className="">
        {/* <_FileUploadCards
      activeFileUploads={activeFileUploads}
      onCancelFileUpload={props.onCancelFileUpload}
      strings={{
        removeFile: props.strings?.removeFile ?? localeStrings.removeFile,
        uploading: props.strings?.uploading ?? localeStrings.uploading,
        uploadCompleted: props.strings?.uploadCompleted ?? localeStrings.uploadCompleted
      }}
    /> */}
      </div>
    );
  }
);
