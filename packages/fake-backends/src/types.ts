// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ChatClient, ChatThreadClient } from '@azure/communication-chat';

export type PublicInterface<T> = { [K in keyof T]: T[K] };

export type IChatClient = PublicInterface<ChatClient>;

export type IChatThreadClient = PublicInterface<ChatThreadClient>;
