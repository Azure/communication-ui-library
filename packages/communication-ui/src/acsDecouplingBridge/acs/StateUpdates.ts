// © Microsoft Corporation. All rights reserved.
import { CallingState } from '../CallingState';

export type CallingStateUpdate = (state: CallingState) => void;
export type CallingStateUpdateAsync = (state: CallingState) => Promise<void>;

export type ChangeEmitter = (update: CallingStateUpdate | CallingStateUpdateAsync | undefined) => Promise<void>;

export const isPromise = <T>(obj: any): obj is Promise<T> => {
  return obj && 'then' in obj;
};

export const concatCallingStateUpdate = async (
  updates: (((draft: CallingState) => Promise<CallingStateUpdate | undefined>) | CallingStateUpdate)[]
): Promise<CallingStateUpdateAsync> => {
  const concatenated = async (draft: CallingState): Promise<void> => {
    for (const apply of updates) {
      const applied = apply(draft);
      const update = isPromise(applied) ? await applied : applied;
      if (update) {
        update(draft);
      }
    }
  };
  return concatenated;
};
