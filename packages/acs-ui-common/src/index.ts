// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export { memoizeFnAll } from './memoizeFnAll';
export {
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  _toCommunicationIdentifier,
  _isValidIdentifier
} from './identifier';
export { _getApplicationId } from './telemetry';
export { _formatString } from './localizationUtils';
export { _safeJSONStringify } from './safeStringify';
export { _convertRemToPx, _preventDismissOnEvent } from './common';

export type { Common, CommonProperties } from './commonProperties';
export type { CallbackType, FunctionWithKey } from './memoizeFnAll';
export type { AreEqual, AreParamEqual, AreTypeEqual } from './areEqual';
export type { MessageStatus } from './MessageStatus';
export type { _IObjectMap } from './localizationUtils';
export type { TelemetryImplementationHint } from './telemetry';

export { _MAX_EVENT_LISTENERS } from './constants';

export { _pxToRem } from './cssUtils';

export { _logEvent } from './logEvent';
export type { TelemetryEvent } from './logEvent';
