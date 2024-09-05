// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentMetadataInProgress, _IMAGE_ATTRIBUTE_INLINE_IMAGE_FILE_NAME_KEY } from '@internal/acs-ui-common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { AttachmentUpload, AttachmentUploadActionType, AttachmentUploadTask } from '../file-sharing/AttachmentUpload';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { _DEFAULT_INLINE_IMAGE_FILE_NAME, SEND_BOX_UPLOADS_KEY_VALUE } from '../../common/constants';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ChatAdapter } from '../adapter/ChatAdapter';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { Dispatch } from 'react';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ImageActions } from './ImageUploadReducer';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { nanoid } from 'nanoid';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { ChatCompositeStrings } from '../Strings';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const MAX_INLINE_IMAGE_UPLOAD_SIZE_MB = 20;

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
/**
 * @private
 */
export const getInlineImageData = async (image: string): Promise<Blob | undefined> => {
  if (image.startsWith('blob') || image.startsWith('http')) {
    try {
      const res = await fetchBlobData(image, { abortController: new AbortController() });
      const blobImage = await res.blob();
      return blobImage;
    } catch (error) {
      console.error('Error fetching image data', error);
      return;
    }
  }
  return;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getEditBoxMessagesInlineImages = (
  editBoxInlineImageUploads: Record<string, AttachmentUpload[]> | undefined
): Record<string, AttachmentMetadataInProgress[]> | undefined => {
  if (!editBoxInlineImageUploads) {
    return;
  }
  const messageIds = Object.keys(editBoxInlineImageUploads || {});
  const messagesInlineImagesWithProgress: Record<string, AttachmentMetadataInProgress[]> = {};
  messageIds.map((messageId) => {
    const messageUploads = editBoxInlineImageUploads[messageId].map((upload) => {
      return upload.metadata;
    });
    messagesInlineImagesWithProgress[messageId] = messageUploads;
  });
  return messagesInlineImagesWithProgress;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getSendBoxInlineImages = (
  sendBoxInlineImageUploads: Record<string, AttachmentUpload[]> | undefined
): AttachmentMetadataInProgress[] | undefined => {
  if (!sendBoxInlineImageUploads) {
    return;
  }
  return sendBoxInlineImageUploads[SEND_BOX_UPLOADS_KEY_VALUE]?.map((upload) => upload.metadata);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const inlineImageUploadHandler = async (
  uploadTasks: AttachmentUpload[],
  adapter: ChatAdapter,
  strings: ChatCompositeStrings
): Promise<void> => {
  for (const task of uploadTasks) {
    const uploadTask = task as AttachmentUploadTask;
    const image: Blob | undefined = uploadTask.image;
    if (!image) {
      uploadTask.notifyUploadFailed(strings.uploadImageDataNotProvided);
      continue;
    }
    if (image && image.size > MAX_INLINE_IMAGE_UPLOAD_SIZE_MB * 1024 * 1024) {
      uploadTask.notifyUploadFailed(
        strings.uploadImageIsTooLarge.replace('{maxImageSize}', `${MAX_INLINE_IMAGE_UPLOAD_SIZE_MB}`)
      );
      continue;
    }

    const SUPPORTED_FILES: Array<string> = ['jpg', 'jpeg', 'png', 'gif', 'heic', 'webp'];
    const imageExtension = task.metadata?.name.split('.').pop() ?? '';
    if (!SUPPORTED_FILES.includes(imageExtension)) {
      uploadTask.notifyUploadFailed(
        strings.uploadImageExtensionIsNotAllowed.replace('{imageExtension}', imageExtension)
      );
      continue;
    }

    try {
      const response = await adapter.uploadImage(image, task.metadata?.name);
      // Use response id as the image src because we need to keep the original image id as a reference to find the image.
      // Also the html content we send to ChatSDK does not need image src,
      // it only need the response id to match the uploaded image, url is not needed.
      uploadTask.notifyUploadCompleted(task.metadata.id, response.id);
    } catch (error) {
      console.error(error);
      uploadTask.notifyUploadFailed(strings.uploadImageFailed);
    }
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const generateUploadTask = async (
  imageAttributes: Record<string, string>,
  fileName: string,
  messageId: string,
  inlineImageUploadActionHandler: Dispatch<ImageActions>
): Promise<AttachmentUpload | undefined> => {
  const imageData = await getInlineImageData(imageAttributes.src);
  if (!imageData) {
    return;
  }
  const taskId = nanoid();
  const uploadTask: AttachmentUpload = {
    image: imageData,
    taskId,
    metadata: {
      id: imageAttributes.id,
      name: fileName,
      url: imageAttributes.src,
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
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const onInsertInlineImageForEditBox = async (
  imageAttributes: Record<string, string>,
  fileName: string,
  messageId: string,
  adapter: ChatAdapter,
  handleEditBoxInlineImageUploadAction: Dispatch<ImageActions>,
  chatCompositeStrings: ChatCompositeStrings
): Promise<void> => {
  const uploadTask: AttachmentUpload | undefined = await generateUploadTask(
    imageAttributes,
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
  inlineImageUploadHandler([uploadTask], adapter, chatCompositeStrings);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const onInsertInlineImageForSendBox = async (
  imageAttributes: Record<string, string>,
  fileName: string,
  adapter: ChatAdapter,
  handleSendBoxInlineImageUploadAction: Dispatch<ImageActions>,
  chatCompositeStrings: ChatCompositeStrings
): Promise<void> => {
  const uploadTask: AttachmentUpload | undefined = await generateUploadTask(
    imageAttributes,
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
  inlineImageUploadHandler([uploadTask], adapter, chatCompositeStrings);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const cancelInlineImageUpload = (
  imageAttributes: Record<string, string>,
  imageUploads: Record<string, AttachmentUpload[]> | undefined,
  messageId: string,
  inlineImageUploadActionHandler: Dispatch<ImageActions>,
  adapter: ChatAdapter
): void => {
  if (!imageUploads || !imageUploads[messageId]) {
    deleteExistingInlineImageForEditBox(imageAttributes.id, messageId, adapter);
    return;
  }
  const imageUpload = imageUploads[messageId].find((upload) => upload.metadata.id === imageAttributes.id);

  if (!imageUpload || !imageUpload?.metadata.id) {
    deleteExistingInlineImageForEditBox(imageAttributes.id, messageId, adapter);
    return;
  }

  inlineImageUploadActionHandler({
    type: AttachmentUploadActionType.Remove,
    id: imageUpload?.metadata.id,
    messageId
  });

  if (imageUpload?.metadata.progress === 1 && imageUpload?.metadata.url) {
    // The image id that we got back from the ChatSDK response is stored in the image src attribute,
    // while the metadata id is the internal image id that we assigned to the image when it was pasted in.
    deleteInlineImageFromServer(imageUpload?.metadata.url, adapter);
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const deleteInlineImageFromServer = (imageId: string, adapter: ChatAdapter): void => {
  try {
    adapter.deleteImage(imageId);
  } catch (error) {
    console.error(error);
  }
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
// This function is used to delete the inline image that existed before editing starts
const deleteExistingInlineImageForEditBox = (imageId: string, messageId: string, adapter: ChatAdapter): void => {
  messageId !== SEND_BOX_UPLOADS_KEY_VALUE && deleteInlineImageFromServer(imageId, adapter);
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const updateContentStringWithUploadedInlineImages = (
  content: string,
  imageUploads: Record<string, AttachmentUpload[]> | undefined,
  messageId: string = SEND_BOX_UPLOADS_KEY_VALUE
): string => {
  if (!imageUploads || !imageUploads[messageId]) {
    return content;
  }
  const messageUploads = imageUploads[messageId];
  const document = new DOMParser().parseFromString(content ?? '', 'text/html');
  document.querySelectorAll('img').forEach((img) => {
    const uploadInlineImage = messageUploads.find(
      (upload) => !upload.metadata.error && upload.metadata.progress === 1 && upload.metadata.id === img.id
    );

    if (uploadInlineImage) {
      // ChatSDK uses the respond id provided by the upload response. We store the response id in the image src attribute previously.
      img.id = uploadInlineImage.metadata.url ?? img.id;
      img.src = '';
    }
  });
  content = document.body.innerHTML;

  return content;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const getImageFileNameFromAttributes = (imageAttributes: Record<string, string>): string => {
  const fileName = imageAttributes[_IMAGE_ATTRIBUTE_INLINE_IMAGE_FILE_NAME_KEY];
  if (!fileName || fileName === '' || fileName === 'undefined' || fileName === 'null') {
    return _DEFAULT_INLINE_IMAGE_FILE_NAME;
  }
  return fileName;
};
