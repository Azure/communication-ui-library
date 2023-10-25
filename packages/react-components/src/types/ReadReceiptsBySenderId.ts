// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/**
 * An array of key value pairs that stores each sender's display name and last read message
 *
 * @public
 */
export type ReadReceiptsBySenderId = { [key: string]: { lastReadMessage: string; displayName: string } };
