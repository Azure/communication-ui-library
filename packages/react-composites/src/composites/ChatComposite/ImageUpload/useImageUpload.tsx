// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { Dispatch, useCallback, useMemo, useReducer } from 'react';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentUpload, AttachmentUploadActionType, AttachmentUploadTask } from '../file-sharing/AttachmentUpload';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { useAdapter } from '../adapter/ChatAdapterProvider';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { nanoid } from 'nanoid';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { getInlineImageData } from './ImageUploadUtils';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ImageActions, ImageUploadReducer } from './ImageUploadReducer';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { SEND_BOX_UPLOADS_KEY_VALUE } from '../../common/constants';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
export const useImageUpload = (): [
  Record<string, AttachmentMetadataInProgress[]> | undefined,
  AttachmentMetadataInProgress[] | undefined,
  Dispatch<ImageActions>,
  Dispatch<ImageActions>,
  onUploadInlineImageForEditBox: (image: string, fileName: string, messageId: string) => Promise<void>,
  onUploadInlineImageForSendBox: (image: string, fileName: string) => Promise<void>,
  onCancelInlineImageUploadHandlerForEditBox: (imageId: string, messageId: string) => void,
  onCancelInlineImageUploadHandlerForSendBox: (imageId: string) => void
] => {
  const MAX_INLINE_IMAGE_UPLOAD_SIZE_MB = 20;
  const adapter = useAdapter();
  const [editBoxInlineImageUploads, handleEditBoxInlineImageUploadAction] = useReducer(ImageUploadReducer, undefined);
  const [sendBoxInlineImageUploads, handleSendBoxInlineImageUploadAction] = useReducer(ImageUploadReducer, undefined);

  const editBoxImageUploadsInProgress: Record<string, AttachmentMetadataInProgress[]> | undefined = useMemo(() => {
    if (!editBoxInlineImageUploads) {
      return;
    }
    const messageIds = Object.keys(editBoxInlineImageUploads || {});
    const imageUploadsInProgress: Record<string, AttachmentMetadataInProgress[]> = {};
    messageIds.map((messageId) => {
      const messageUploads = editBoxInlineImageUploads[messageId].map((upload) => {
        return upload.metadata;
      });
      imageUploadsInProgress[messageId] = messageUploads;
    });
    return imageUploadsInProgress;
  }, [editBoxInlineImageUploads]);

  const sendBoxImageUploadsInProgress: AttachmentMetadataInProgress[] | undefined = useMemo(() => {
    if (!sendBoxInlineImageUploads) {
      return;
    }
    return sendBoxInlineImageUploads[SEND_BOX_UPLOADS_KEY_VALUE]?.map((upload) => upload.metadata);
  }, [sendBoxInlineImageUploads]);

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

  const generateUploadTask = useCallback(
    async (
      image: string,
      fileName: string,
      messageId: string,
      inlineImageUploadActionHandler: Dispatch<ImageActions>
    ): Promise<AttachmentUpload | undefined> => {
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
          inlineImageUploadActionHandler({
            type: AttachmentUploadActionType.Progress,
            taskId,
            progress: value,
            messageId
          });
        },
        notifyUploadCompleted: (id: string, url: string) => {
          inlineImageUploadActionHandler({
            type: AttachmentUploadActionType.Completed,
            taskId,
            id,
            url,
            messageId
          });
        },
        notifyUploadFailed: (message: string) => {
          inlineImageUploadActionHandler({ type: AttachmentUploadActionType.Failed, taskId, message, messageId });
          // remove the failed upload task when error banner is auto dismissed after 10 seconds
          // so the banner won't be shown again on UI re-rendering.
          setTimeout(() => {
            inlineImageUploadActionHandler({ type: AttachmentUploadActionType.Remove, id: taskId, messageId });
          }, 10 * 1000);
        }
      };
      return uploadTask;
    },
    []
  );

  const onUploadInlineImageForEditBox = useCallback(
    async (image: string, fileName: string, messageId: string): Promise<void> => {
      const uploadTask: AttachmentUpload | undefined = await generateUploadTask(
        image,
        fileName,
        messageId,
        handleEditBoxInlineImageUploadAction
      );
      if (!uploadTask) {
        return;
      }

      handleEditBoxInlineImageUploadAction({
        type: AttachmentUploadActionType.Set,
        newUploads: [uploadTask],
        messageId
      });
      inlineImageUploadHandler([uploadTask]);
    },
    [generateUploadTask, inlineImageUploadHandler]
  );

  const onUploadInlineImageForSendBox = useCallback(
    async (image: string, fileName: string): Promise<void> => {
      const uploadTask: AttachmentUpload | undefined = await generateUploadTask(
        image,
        fileName,
        SEND_BOX_UPLOADS_KEY_VALUE,
        handleSendBoxInlineImageUploadAction
      );

      if (!uploadTask) {
        return;
      }

      handleSendBoxInlineImageUploadAction({
        type: AttachmentUploadActionType.Set,
        newUploads: [uploadTask],
        messageId: SEND_BOX_UPLOADS_KEY_VALUE
      });
      inlineImageUploadHandler([uploadTask]);
    },
    [generateUploadTask, inlineImageUploadHandler]
  );

  const cancelInlineImageUpload = useCallback(
    (
      imageId: string,
      imageUpload: AttachmentUpload | undefined,
      messageId: string,
      inlineImageUploadActionHandler: Dispatch<ImageActions>
    ) => {
      if (!imageUpload || !imageUpload?.metadata.id) {
        return;
      }

      inlineImageUploadActionHandler({
        type: AttachmentUploadActionType.Remove,
        id: imageUpload?.metadata.id,
        messageId
      });
      // TODO: remove local blob
      if (imageUpload?.metadata.progress === 1) {
        try {
          adapter.deleteImage(imageId);
        } catch (error) {
          console.error(error);
        }
      }
    },
    [adapter]
  );

  const onCancelInlineImageUploadHandlerForEditBox = useCallback(
    (imageId: string, messageId: string) => {
      if (!editBoxInlineImageUploads) {
        return;
      }
      const imageUpload = editBoxInlineImageUploads[messageId].find((upload) => upload.metadata.id === imageId);

      cancelInlineImageUpload(imageId, imageUpload, messageId, handleEditBoxInlineImageUploadAction);
    },
    [cancelInlineImageUpload, editBoxInlineImageUploads]
  );

  const onCancelInlineImageUploadHandlerForSendBox = useCallback(
    (imageId: string) => {
      if (!sendBoxInlineImageUploads) {
        return;
      }
      const imageUpload = sendBoxInlineImageUploads[SEND_BOX_UPLOADS_KEY_VALUE].find(
        (upload) => upload.metadata.id === imageId
      );

      cancelInlineImageUpload(imageId, imageUpload, SEND_BOX_UPLOADS_KEY_VALUE, handleSendBoxInlineImageUploadAction);
    },
    [cancelInlineImageUpload, sendBoxInlineImageUploads]
  );

  return [
    editBoxImageUploadsInProgress,
    sendBoxImageUploadsInProgress,
    handleEditBoxInlineImageUploadAction,
    handleSendBoxInlineImageUploadAction,
    onUploadInlineImageForEditBox,
    onUploadInlineImageForSendBox,
    onCancelInlineImageUploadHandlerForEditBox,
    onCancelInlineImageUploadHandlerForSendBox
  ];
};
