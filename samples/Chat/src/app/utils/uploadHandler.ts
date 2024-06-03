// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(attachment-byos) */
import { AttachmentSelectionHandler, AttachmentUploadOptions, AttachmentUploadTask } from '@azure/communication-react';
/* @conditional-compile-remove(attachment-byos) */
import axios, { AxiosProgressEvent } from 'axios';
/* @conditional-compile-remove(attachment-byos) */
import FormData from 'form-data';

/* @conditional-compile-remove(attachment-byos) */
// max file size is 50MB
const MAX_FILE_SIZE_MB = 50 * 1024 * 1024; // 50MB
/* @conditional-compile-remove(attachment-byos) */
const UNSUPPORTED_FILES = ['exe', 'bat', 'dat'];
/* @conditional-compile-remove(attachment-byos) */
// change this to your own container name
const CONTAINER_NAME = 'acs-file-sharing-test';

/* @conditional-compile-remove(attachment-byos) */
const attachmentSelectionHandler: AttachmentSelectionHandler = async (
  uploadTasks: AttachmentUploadTask[]
): Promise<void> => {
  for (const task of uploadTasks) {
    const fileExtension = task.file?.name.split('.').pop() ?? '';

    if (task.file && task.file?.size > MAX_FILE_SIZE_MB) {
      task.notifyUploadFailed(`"${task.file?.name}" is too big. Select a file under 50MB.`);
      continue;
    }

    if (UNSUPPORTED_FILES.includes(fileExtension)) {
      task.notifyUploadFailed(`Uploading ".${fileExtension}" files is not allowed.`);
      continue;
    }

    const uniqueFileName = `${task.file?.name}`;
    const formData = new FormData();
    formData.append('file', task.file, task.file?.name);

    try {
      const response = await axios.request({
        method: 'post',
        url: `/uploadToAzureBlobStorage/file/${uniqueFileName}/${CONTAINER_NAME}`,
        data: formData,
        headers: {
          'Content-Type': `multipart/form-data`,
          'Access-Control-Allow-Origin': '*'
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          const { total, loaded } = progressEvent;
          if (total) {
            // cap progress at 95% because progress should
            // only be 100% when notifyUploadCompleted is called
            // we cap at 95% not 99% is to make it consistent with upoad
            // where 0 progress shows 5% progress in the UI
            task.notifyUploadProgressChanged(Math.min(0.95, loaded / total));
          }
        }
      });
      const randomId = Math.random().toString(16).slice(2);
      task.notifyUploadCompleted(randomId, response.data.url);
    } catch (error) {
      console.error(error);
      task.notifyUploadFailed('Unable to upload file. Please try again later.');
    }
  }
};
/* @conditional-compile-remove(attachment-byos) */
export const attachmentUploadOptions: AttachmentUploadOptions = {
  handleAttachmentSelection: attachmentSelectionHandler
};
