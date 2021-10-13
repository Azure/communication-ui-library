// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * @private
 */
export interface PollOption {
  option: string;
  votes?: number;
}

/**
 * @private
 */
export type PollOptions = PollOption[];

/**
 * @private
 */
export interface PollData {
  prompt: string;
  options: PollOptions;
}
