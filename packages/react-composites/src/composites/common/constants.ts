// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * @private
 */
export const UNSUPPORTED_CHAT_THREAD_TYPE = ['@thread.tacv2', '@thread.skype'];

/**
 * @private
 */
export const TEAMS_LIMITATION_LEARN_MORE =
  'https://learn.microsoft.com/en-us/azure/communication-services/concepts/join-teams-meeting#limitations-and-known-issues';

/**
 * @remarks
 * This value is publicly documented in the ChatComposite API documentation.
 * Changing this value will require updating the API documentation.
 */
export const CHAT_CONTAINER_MIN_WIDTH_REM = 17.5;

/**
 * @private
 */
export const SEND_BOX_UPLOADS_KEY_VALUE = 'send-box';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * Default rich text editor inline image file name
 * @internal
 */
export const _DEFAULT_INLINE_IMAGE_FILE_NAME = 'image.png';
