// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './composites';
export type { CommunicationUiErrorArgs, CommunicationUiErrorInfo, CommunicationUiErrorSeverity } from './types';

export { propagateError, getIdFromToken, createAzureCommunicationUserCredential } from './utils';
export {
  CommunicationUiError,
  CommunicationUiErrorCode,
  CommunicationUiErrorFromError
} from './types/CommunicationUiError';
export type { DevicePermissionState } from './types/DevicePermission';
