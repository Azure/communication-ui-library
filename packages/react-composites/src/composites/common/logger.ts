// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { createClientLogger } from '@azure/logger';

/**
 * @private
 */
export const compositeLogger = createClientLogger('communication-react:composite');

/**
 * @private
 * Enum for event names used in the composite logger.
 * These events are used to track various actions and states within the composite.
 */
export enum EventNames {
    // Info
    COMPOSITE_INITIALIZED = 'COMPOSITE_INITIALIZED',
    COMPOSITE_RENDERED = 'COMPOSITE_RENDERED',
    COMPOSITE_CLOSED = 'COMPOSITE_CLOSED',
    COMPOSITE_AUDIO_CONTEXT_CREATED = 'COMPOSITE_AUDIO_CONTEXT_CREATED',
    COMPOSITE_AUDIO_CONTEXT_CLOSED = 'COMPOSITE_AUDIO_CONTEXT_CLOSED',
    COMPOSITE_AUDIO_CONTEXT_RECREATED = 'COMPOSITE_AUDIO_CONTEXT_RECREATED',
    
    // Warning
    COMPOSITE_WARNING = 'COMPOSITE_WARNING',
    
    // Error
    COMPOSITE_ERROR = 'COMPOSITE_ERROR'
}
