// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentSelectionHandler, AttachmentUploadOptions, AttachmentUploadTask } from '@azure/communication-react';
/* @conditional-compile-remove(file-sharing-acs) */
import axios, { AxiosProgressEvent } from 'axios';
/* @conditional-compile-remove(file-sharing-acs) */
import FormData from 'form-data';

/* @conditional-compile-remove(file-sharing-acs) */
// max file size is 50MB
const MAX_FILE_SIZE_MB = 50; // 50MB
/* @conditional-compile-remove(file-sharing-acs) */
const MAX_FILE_SIZE = MAX_FILE_SIZE_MB * 1024 * 1024; // 50MB
/* @conditional-compile-remove(file-sharing-acs) */
const UNSUPPORTED_FILES = ['exe', 'bat', 'dat'];
/* @conditional-compile-remove(file-sharing-acs) */
// change this to your own container name
const CONTAINER_NAME = 'acs-file-sharing-test';

/* @conditional-compile-remove(file-sharing-acs) */
const attachmentSelectionHandler: AttachmentSelectionHandler = async (
  uploadTasks: AttachmentUploadTask[]
): Promise<void> => {
  for (const task of uploadTasks) {
    const fileExtension = task.file?.name.split('.').pop() ?? '';

    if (task.file && task.file?.size > MAX_FILE_SIZE) {
      task.notifyUploadFailed(`"${task.file?.name}" is too large. Choose one that's less than ${MAX_FILE_SIZE_MB} MB.`);
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
/* @conditional-compile-remove(file-sharing-acs) */
export const attachmentUploadOptions: AttachmentUploadOptions = {
  handleAttachmentSelection: attachmentSelectionHandler
};
