// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Client-side state of a sent message.
 *
 * Includes transitional states that occur before message delivery is confirmed from the backend.
 *
 * @public
 */
export type MessageStatus = 'delivered' | 'sending' | 'seen' | 'failed';
