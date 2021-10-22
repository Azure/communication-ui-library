// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export { memoizeFnAll } from './memoizeFnAll';
export { fromFlatCommunicationIdentifier, toFlatCommunicationIdentifier } from './identifier';
export { _getApplicationId } from './telemetry';
export { formatSpanElements, formatString } from './localizationUtils';

export type { Common, CommonProperties } from './commonProperties';
export type { CallbackType, FunctionWithKey } from './memoizeFnAll';
export type { AreEqual, AreParamEqual, AreTypeEqual } from './areEqual';
export type { MessageStatus } from './MessageStatus';
export type { IObjectMap } from './localizationUtils';
