// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
export * from './FileCard';
export * from './FileCardGroup';
export * from './FileUploadButton';
export * from './FileUploadHandler';
export * from './UploadedFile';

/**
 * @internal
 */
export const ACSFilesMetadataKey = 'acsfiles';

/**
 * Metadata used for setting uploaded files by a user using chat composite in a group call.
 * @internal
 */
export type ACSFilesMetaData = {
  [ACSFilesMetadataKey]: string;
};
