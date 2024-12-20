// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export { memoizeFnAll } from './memoizeFnAll';
export {
  fromFlatCommunicationIdentifier,
  toFlatCommunicationIdentifier,
  _toCommunicationIdentifier,
  _isValidIdentifier,
  _isIdentityMicrosoftTeamsUser
} from './identifier';
export { _getApplicationId } from './telemetry';
export { _formatString } from './localizationUtils';
export { _safeJSONStringify } from './safeStringify';
export { _convertPxToRem, _convertRemToPx, _preventDismissOnEvent, _getKeys } from './common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
export { _base64ToBlob } from './dataConversion';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
export { removeImageTags } from './removeImageTags';

export type { Common, CommonProperties } from './commonProperties';
export type { CallbackType, FunctionWithKey } from './memoizeFnAll';
export type { AreEqual, AreParamEqual, AreTypeEqual } from './areEqual';
export type { MessageStatus } from './MessageStatus';
export type { _IObjectMap } from './localizationUtils';
export type { _TelemetryImplementationHint } from './telemetry';

export { _MAX_EVENT_LISTENERS } from './constants';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
export { _IMAGE_ATTRIBUTE_INLINE_IMAGE_FILE_NAME_KEY } from './constants';

export { _pxToRem, _remToPx } from './cssUtils';

export { _logEvent } from './logEvent';
export type { TelemetryEvent } from './logEvent';

export type { AttachmentMetadata, AttachmentMetadataInProgress, AttachmentProgressError } from './common';
/* @conditional-compile-remove(rich-text-editor-image-upload) */
export type { UploadChatImageResult } from './common';

export type { MessageOptions, ChatMessageType } from './common';
