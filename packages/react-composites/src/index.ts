// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './index-public';

// The following types are used by other @internal packages, but are not exported by @azure/communication-react.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
export { _DEFAULT_INLINE_IMAGE_FILE_NAME } from './composites/common/constants';
export { _useCompositeLocale } from './composites/localization';
export { _createAzureCommunicationCallWithChatAdapterFromAdapters } from './composites/CallWithChatComposite/adapter/AzureCommunicationCallWithChatAdapter';
export type { _ChatThreadRestError, _FakeChatAdapters, _FakeChatAdapterArgs, _MockAttachmentUpload } from './mocks';
export { _useFakeChatAdapters } from './mocks';
export { _MockCallAdapter } from './composites/CallComposite/MockCallAdapter';
export { _createAzureCommunicationCallAdapterInner } from './composites/CallComposite/adapter/AzureCommunicationCallAdapter';
export { _createAzureCommunicationChatAdapterInner } from './composites/ChatComposite/adapter/AzureCommunicationChatAdapter';
