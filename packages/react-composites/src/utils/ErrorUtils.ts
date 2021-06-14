// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CallContext } from '../composites/CallComposite/adapter/AzureCommunicationCallAdapter';
import { ChatContext } from '../composites/ChatComposite/adapter/AzureCommunicationChatAdapter';
import EventEmitter from 'events';

/**
 * Helper function to reduce duplicate code.
 *
 * @param context
 * @param emitter
 * @param functionToWrap
 * @param defaultReturn
 * @returns
 */
export async function withErrorHandling<T>(
  context: ChatContext | CallContext,
  emitter: EventEmitter,
  functionToWrap: () => Promise<T>,
  defaultReturn: Promise<T>
): Promise<T> {
  try {
    return await functionToWrap();
  } catch (e) {
    context.setError(e);
    emitter.emit('error', e);
    return defaultReturn;
  }
}
