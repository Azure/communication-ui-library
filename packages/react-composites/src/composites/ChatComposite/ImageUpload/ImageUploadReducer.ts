// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import {
  Action,
  AttachmentUpload,
  AttachmentUploadActionType,
  ProgressAction,
  CompleteAction,
  FailedAction,
  RemoveAction,
  ClearAction
} from '../file-sharing/AttachmentUpload';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
export interface ImageAction {
  messageId: string;
}
/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
interface ImageSetAction extends Action, ImageAction {
  type: AttachmentUploadActionType.Set;
  newUploads: AttachmentUpload[];
}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
interface ImageProgressAction extends ProgressAction, ImageAction {}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
interface ImageCompleteAction extends CompleteAction, ImageAction {}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
interface ImageFailedAction extends FailedAction, ImageAction {}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
interface ImageRemoveAction extends RemoveAction, ImageAction {}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
interface ImageClearAction extends ClearAction, ImageAction {}

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
export type ImageActions =
  | ImageSetAction
  | ImageProgressAction
  | ImageCompleteAction
  | ImageFailedAction
  | ImageRemoveAction
  | ImageClearAction;

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 */
export const ImageUploadReducer = (
  state: Record<string, AttachmentUpload[]> | undefined,
  action: ImageActions
): Record<string, AttachmentUpload[]> | undefined => {
  const messageId = action.messageId;
  const messageState = state && state[messageId];
  switch (action.type) {
    case AttachmentUploadActionType.Set:
      if (!messageState || messageState.length === 0) {
        return { ...state, [messageId]: action.newUploads };
      }
      return {
        ...state,
        [messageId]: messageState.filter((v) => !v.metadata.error).concat(action.newUploads)
      };

    case AttachmentUploadActionType.Completed:
      if (!messageState) {
        return state;
      }

      return {
        ...state,
        [messageId]: messageState.map((v) =>
          v.taskId === action.taskId
            ? { ...v, metadata: { ...v.metadata, id: action.id, url: action.url, progress: 1 } }
            : v
        )
      };

    case AttachmentUploadActionType.Failed:
      if (!messageState) {
        return state;
      }
      return {
        ...state,
        [messageId]: messageState.map((v) =>
          v.taskId === action.taskId
            ? {
                ...v,
                metadata: {
                  ...v.metadata,
                  error: {
                    message: action.message
                  }
                }
              }
            : v
        )
      };

    case AttachmentUploadActionType.Remove:
      if (!messageState) {
        return state;
      }
      return {
        ...state,
        [messageId]: messageState.filter((v) => !v.metadata.error).filter((v) => v.metadata.id !== action.id)
      };

    case AttachmentUploadActionType.Progress:
      if (!messageState) {
        return state;
      }
      return {
        ...state,
        [messageId]: messageState.map((v) =>
          v.taskId === action.taskId ? { ...v, metadata: { ...v.metadata, progress: action.progress } } : v
        )
      };

    case AttachmentUploadActionType.Clear:
      return { ...state, [messageId]: [] };
    default:
      return state;
  }
};
