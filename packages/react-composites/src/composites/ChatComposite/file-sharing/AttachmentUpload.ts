// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentUploadTask, AttachmentSelectionHandler, AttachmentActionHandler } from '@internal/react-components';
/* @conditional-compile-remove(file-sharing-acs) */
import { AttachmentMetadata, AttachmentMetadataInProgress, AttachmentProgressError } from '@internal/acs-ui-common';

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @internal
 */
export interface AttachmentUpload extends AttachmentUploadTask {
  metadata: AttachmentMetadataInProgress;
}

/**
 * @private
 */
export enum AttachmentUploadActionType {
  Set = 'set',
  Progress = 'progress',
  Completed = 'completed',
  Failed = 'failed',
  Remove = 'remove',
  Clear = 'clear'
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export interface Action {
  type: AttachmentUploadActionType;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
interface SetAction extends Action {
  type: AttachmentUploadActionType.Set;
  newUploads: AttachmentUpload[];
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export interface ProgressAction extends Action {
  type: AttachmentUploadActionType.Progress;
  taskId: string;
  progress: number;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export interface CompleteAction extends Action {
  type: AttachmentUploadActionType.Completed;
  taskId: string;
  id: string;
  url: string;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export interface FailedAction extends Action {
  type: AttachmentUploadActionType.Failed;
  taskId: string;
  message: string;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export interface RemoveAction extends Action {
  type: AttachmentUploadActionType.Remove;
  id: string;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
export interface ClearAction extends Action {
  type: AttachmentUploadActionType.Clear;
}

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @private
 */
type Actions = SetAction | ProgressAction | CompleteAction | FailedAction | RemoveAction | ClearAction;

/* @conditional-compile-remove(file-sharing-acs) */
/**
 * @internal
 */
export const AttachmentUploadReducer = (state: AttachmentUpload[], action: Actions): AttachmentUpload[] => {
  switch (action.type) {
    case AttachmentUploadActionType.Set:
      return state.filter((v) => !v.metadata.error).concat(action.newUploads);

    case AttachmentUploadActionType.Completed:
      return state.map((v) =>
        v.taskId === action.taskId
          ? { ...v, metadata: { ...v.metadata, id: action.id, url: action.url, progress: 1 } }
          : v
      );

    case AttachmentUploadActionType.Failed:
      return state.map((v) =>
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
      );

    case AttachmentUploadActionType.Remove:
      return state.filter((v) => !v.metadata.error).filter((v) => v.metadata.id !== action.id);

    case AttachmentUploadActionType.Progress:
      return state.map((v) =>
        v.taskId === action.taskId ? { ...v, metadata: { ...v.metadata, progress: action.progress } } : v
      );

    case AttachmentUploadActionType.Clear:
      return [];
    default:
      return state;
  }
};

/* @conditional-compile-remove(file-sharing-acs) */
export type {
  AttachmentMetadata,
  AttachmentSelectionHandler,
  AttachmentActionHandler,
  AttachmentUploadTask,
  AttachmentProgressError
};
