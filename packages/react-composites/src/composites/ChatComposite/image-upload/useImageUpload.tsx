// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { Dispatch, useCallback, useReducer } from 'react';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import {
  AttachmentUpload,
  AttachmentUploadActionType,
  AttachmentUploadReducer,
  AttachmentUploadTask,
  Actions
} from '../file-sharing/AttachmentUpload';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { useAdapter } from '../adapter/ChatAdapterProvider';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { nanoid } from 'nanoid';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const fetchBlobData = async (
  resource: string | URL | Request,
  options: { timeout?: number; headers?: Headers; abortController: AbortController }
): Promise<Response> => {
  // default timeout is 30 seconds
  const { timeout = 30000, abortController } = options;

  const id = setTimeout(() => {
    abortController.abort();
  }, timeout);

  const response = await fetch(resource, {
    ...options,
    signal: abortController.signal
  });
  clearTimeout(id);
  return response;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const getInlineImageData = async (image: string): Promise<Blob | undefined> => {
  const blobImage: Blob | undefined = undefined;
  if (image.startsWith('blob') || image.startsWith('http')) {
    const res = await fetchBlobData(image, { abortController: new AbortController() });
    const blobImage = await res.blob();
    return blobImage;
  }
  return blobImage;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
export const useImageUpload = (): [
  AttachmentUpload[],
  Dispatch<Actions>,
  onUploadInlineImage: (image: string, fileName: string) => Promise<void>,
  onCancelInlineImageUploadHandler: (imageId: string) => void
] => {
  const MAX_INLINE_IMAGE_UPLOAD_SIZE_MB = 20;
  const adapter = useAdapter();
  const [inlineImageUploads, handleInlineImageUploadAction] = useReducer(AttachmentUploadReducer, []);

  const inlineImageUploadHandler = useCallback(
    async (uploadTasks: AttachmentUpload[]): Promise<void> => {
      for (const task of uploadTasks) {
        const uploadTask = task as AttachmentUploadTask;
        const image: Blob | undefined = uploadTask.image;
        if (!image) {
          uploadTask.notifyUploadFailed(`Image data for "${task.metadata?.name}" is not provided.`);
          continue;
        }
        if (image && image.size > MAX_INLINE_IMAGE_UPLOAD_SIZE_MB * 1024 * 1024) {
          uploadTask.notifyUploadFailed(
            `"${task.metadata?.name}" is too big. Select a file under ${MAX_INLINE_IMAGE_UPLOAD_SIZE_MB}MB.`
          );
          continue;
        }

        const SUPPORTED_FILES: Array<string> = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'];
        const imageExtension = task.metadata?.name.split('.').pop() ?? '';
        if (!SUPPORTED_FILES.includes(imageExtension)) {
          uploadTask.notifyUploadFailed(`Uploading ".${imageExtension}" image is not allowed.`);
          continue;
        }

        try {
          const response = await adapter.uploadImage(image, task.metadata?.name);
          uploadTask.notifyUploadCompleted(response.id, task.metadata.url || '');
        } catch (error) {
          console.error(error);
          uploadTask.notifyUploadFailed('Unable to upload inline image. Please try again later.');
        }
      }
    },
    [adapter]
  );

  const onUploadInlineImage = useCallback(
    async (image: string, fileName: string): Promise<void> => {
      if (!image) {
        return;
      }
      const imageData = await getInlineImageData(image);
      if (!imageData) {
        return;
      }
      const taskId = nanoid();
      const uploadTask: AttachmentUpload = {
        image: imageData,
        taskId,
        metadata: {
          id: taskId,
          name: fileName,
          url: image,
          progress: 0
        },
        notifyUploadProgressChanged: (value: number) => {
          handleInlineImageUploadAction({ type: AttachmentUploadActionType.Progress, taskId, progress: value });
        },
        notifyUploadCompleted: (id: string, url: string) => {
          handleInlineImageUploadAction({ type: AttachmentUploadActionType.Completed, taskId, id, url });
        },
        notifyUploadFailed: (message: string) => {
          handleInlineImageUploadAction({ type: AttachmentUploadActionType.Failed, taskId, message });
          // remove the failed upload task when error banner is auto dismissed after 10 seconds
          // so the banner won't be shown again on UI re-rendering.
          setTimeout(() => {
            handleInlineImageUploadAction({ type: AttachmentUploadActionType.Remove, id: taskId });
          }, 10 * 1000);
        }
      };

      const newUploads = [uploadTask];
      handleInlineImageUploadAction({ type: AttachmentUploadActionType.Set, newUploads });
      inlineImageUploadHandler(newUploads);
    },
    [inlineImageUploadHandler]
  );

  const onCancelInlineImageUploadHandler = useCallback(
    (imageId: string) => {
      const imageUpload = inlineImageUploads.find((upload) => upload.metadata.id === imageId);
      const uploadId = imageUpload?.metadata.id;
      if (!uploadId) {
        return;
      }
      handleInlineImageUploadAction({ type: AttachmentUploadActionType.Remove, id: uploadId });
      // TODO: remove local blob
      if (imageUpload?.metadata.progress === 1) {
        adapter.deleteImage(imageId);
      }
    },
    [adapter, inlineImageUploads]
  );
  return [inlineImageUploads, handleInlineImageUploadAction, onUploadInlineImage, onCancelInlineImageUploadHandler];
};
