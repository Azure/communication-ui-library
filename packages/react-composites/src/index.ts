// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './composites';
export type { CommunicationUiErrorArgs, CommunicationUiErrorInfo, CommunicationUiErrorSeverity } from './types';

// Exports currently used by samples
// TODO: remove this once the samples use entirely stateful architecture
export * from './consumers';
export * from './providers';
export { WithErrorHandling, propagateError, getIdFromToken, createAzureCommunicationUserCredential } from './utils';
export {
  CommunicationUiError,
  CommunicationUiErrorCode,
  CommunicationUiErrorFromError
} from './types/CommunicationUiError';
export type { DevicePermissionState } from './types/DevicePermission';
