// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { createClientLogger } from '@azure/logger';

/**
 * @private
 */
export const perfLogger = createClientLogger('communication-react:composite-perf-counter');

/**
 * @private
 */
export enum EventNames {
  SELECTOR_PARENT_RENDER = 'SELECTOR_PARENT_RENDER',
  SELECTOR_RETURN_CHANGED = 'SELECTOR_RETURN_CHANGED'
}
