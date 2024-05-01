// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { AttachmentUploadTask, AttachmentMetadataWithProgress } from '@internal/react-components';

/**
 * @internal
 */
export interface AttachmentUpload extends AttachmentUploadTask {
  metadata: AttachmentMetadataWithProgress;
}

/**
 * @private
 */
export enum AttachmentActionType {
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
  type: AttachmentActionType;
}

/**
 * @private
 */
interface SetAction extends Action {
  type: AttachmentActionType.Set;
  newUploads: AttachmentUpload[];
}

/**
 * @private
 */
interface ProgressAction extends Action {
  type: AttachmentActionType.Progress;
  taskId: string;
  progress: number;
}

/**
 * @private
 */
interface CompleteAction extends Action {
  type: AttachmentActionType.Completed;
  taskId: string;
  id: string;
  url: string;
}

/**
 * @private
 */
interface FailedAction extends Action {
  type: AttachmentActionType.Failed;
  taskId: string;
  message: string;
}

/**
 * @private
 */
interface RemoveAction extends Action {
  type: AttachmentActionType.Remove;
  id: string;
}

/**
 * @private
 */
interface ClearAction extends Action {
  type: AttachmentActionType.Clear;
}

/**
 * @private
 */
type Actions = SetAction | ProgressAction | CompleteAction | FailedAction | RemoveAction | ClearAction;

/**
 * @internal
 */
export const uploadReducer = (state: AttachmentUpload[], action: Actions): AttachmentUpload[] => {
  switch (action.type) {
    case AttachmentActionType.Set:
      return action.newUploads;

    case AttachmentActionType.Completed:
      return state.map((v) =>
        v.taskId === action.taskId
          ? { ...v, metadata: { ...v.metadata, id: action.id, url: action.url, progress: 1 } }
          : v
      );

    case AttachmentActionType.Failed:
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

    case AttachmentActionType.Remove:
      return state.filter((v) => v.metadata.id !== action.id);

    case AttachmentActionType.Progress:
      return state.map((v) =>
        v.taskId === action.taskId ? { ...v, metadata: { ...v.metadata, progress: action.progress } } : v
      );

    case AttachmentActionType.Clear:
      return [];
    default:
      return state;
  }
};
