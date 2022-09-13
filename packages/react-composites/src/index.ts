// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

export * from './index-public';

// The following types are used by other @internal packages, but are not exported by @azure/communication-react.

export { _useCompositeLocale } from './composites/localization';
export { _createAzureCommunicationCallWithChatAdapterFromAdapters } from './composites/CallWithChatComposite/adapter/AzureCommunicationCallWithChatAdapter';

export * from './composites/PreCallComposite';
