// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

export * from './index-public';

// The following types are used by other @internal packages, but are not exported by @azure/communication-react.

export { _useCompositeLocale } from './composites/localization';
export { _createAzureCommunicationCallWithChatAdapterFromAdapters } from './composites/CallWithChatComposite/adapter/AzureCommunicationCallWithChatAdapter';
export type { _ChatThreadRestError, _FakeChatAdapters, _FakeChatAdapterArgs, _MockFileUpload } from './mocks';
export { _useFakeChatAdapters } from './mocks';
export { _MockCallAdapter } from './composites/CallComposite/MockCallAdapter';
