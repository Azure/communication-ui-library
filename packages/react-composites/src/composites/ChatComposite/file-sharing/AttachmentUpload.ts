// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  AttachmentMetadata,
  AttachmentUploadTask,
  AttachmentProgressError,
  AttachmentSelectionHandler,
  AttachmentActionHandler,
  AttachmentMetadataWithProgress
} from '@internal/react-components';

/**
 * @internal
 */
export interface AttachmentUpload extends AttachmentUploadTask {
  metadata: AttachmentMetadataWithProgress;
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

/**
 * @private
 */
interface Action {
  type: AttachmentUploadActionType;
}

/**
 * @private
 */
interface SetAction extends Action {
  type: AttachmentUploadActionType.Set;
  newUploads: AttachmentUpload[];
}

/**
 * @private
 */
interface ProgressAction extends Action {
  type: AttachmentUploadActionType.Progress;
  taskId: string;
  progress: number;
}

/**
 * @private
 */
interface CompleteAction extends Action {
  type: AttachmentUploadActionType.Completed;
  taskId: string;
  id: string;
  url: string;
}

/**
 * @private
 */
interface FailedAction extends Action {
  type: AttachmentUploadActionType.Failed;
  taskId: string;
  message: string;
}

/**
 * @private
 */
interface RemoveAction extends Action {
  type: AttachmentUploadActionType.Remove;
  id: string;
}

/**
 * @private
 */
interface ClearAction extends Action {
  type: AttachmentUploadActionType.Clear;
}

/**
 * @private
 */
type Actions = SetAction | ProgressAction | CompleteAction | FailedAction | RemoveAction | ClearAction;

/**
 * @internal
 */
export const AttachmentUploadReducer = (state: AttachmentUpload[], action: Actions): AttachmentUpload[] => {
  switch (action.type) {
    case AttachmentUploadActionType.Set:
      return state.concat(action.newUploads);

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
      return state.filter((v) => v.metadata.id !== action.id);

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

export type {
  AttachmentMetadata,
  AttachmentSelectionHandler,
  AttachmentActionHandler,
  AttachmentUploadTask,
  AttachmentProgressError
};
