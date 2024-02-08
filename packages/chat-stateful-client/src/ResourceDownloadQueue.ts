// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatContext } from './ChatContext';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatError } from './ChatClientState';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import type { CommunicationTokenCredential } from '@azure/communication-common';

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * @private
 */
export class ResourceDownloadQueue {
  private _messagesNeedingResourceRetrieval: ChatMessageWithStatus[] = [];
  private _context: ChatContext;
  private isActive = false;
  private _credential: CommunicationTokenCredential;

  constructor(context: ChatContext, credential: CommunicationTokenCredential) {
    this._context = context;
    this._credential = credential;
  }

  public containsMessageWithSameAttachments(message: ChatMessageWithStatus): boolean {
    let contains = false;
    const incomingAttachment = message.content?.attachments;
    if (incomingAttachment) {
      for (const m of this._messagesNeedingResourceRetrieval) {
        const existingAttachment = m.content?.attachments ?? [];
        contains = incomingAttachment.every((element, index) => element === existingAttachment[index]);
        if (contains) {
          break;
        }
      }
    }

    return contains;
  }

  public addMessage(message: ChatMessageWithStatus): void {
    // make a copy of message and add to queue
    const copy = { ...message };
    this._messagesNeedingResourceRetrieval.push(copy);
  }

  public async startQueue(threadId: string, operation: ImageRequest, options?: { singleUrl: string }): Promise<void> {
    if (this.isActive) {
      return;
    }

    while (this._messagesNeedingResourceRetrieval.length > 0) {
      this.isActive = true;
      let message = this._messagesNeedingResourceRetrieval.shift();
      if (!message) {
        this.isActive = false;
        continue;
      }

      try {
        if (options) {
          const singleUrl = options.singleUrl;
          message = await this.downloadSingleUrl(message, singleUrl, operation);
        } else {
          message = await this.downloadAllPreviewUrls(message, operation);
        }

        this.isActive = false;
        this._context.setChatMessage(threadId, message);
      } catch (error) {
        console.log('Downloading Resource error: ', error);
      }
    }
  }

  private async downloadSingleUrl(
    message: ChatMessageWithStatus,
    resourceUrl: string,
    operation: ImageRequest
  ): Promise<ChatMessageWithStatus> {
    if (message.resourceCache === undefined) {
      message.resourceCache = {};
    }

    const blobUrl = await operation(resourceUrl, this._credential);
    message.resourceCache[resourceUrl] = blobUrl;
    return message;
  }

  private async downloadAllPreviewUrls(
    message: ChatMessageWithStatus,
    operation: ImageRequest
  ): Promise<ChatMessageWithStatus> {
    const attachments = message.content?.attachments;
    if (message.type === 'html' && attachments) {
      if (message.resourceCache === undefined) {
        message.resourceCache = {};
      }
      for (const attachment of attachments) {
        if (attachment.previewUrl) {
          const blobUrl = await operation(attachment.previewUrl, this._credential);
          message.resourceCache[attachment.previewUrl] = blobUrl;
        }
      }
    }

    return message;
  }
}
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * @private
 */
export const requestPreviewUrl = async (
  message: ChatMessageWithStatus,
  credential: CommunicationTokenCredential
): Promise<ChatMessageWithStatus> => {
  const attachments = message.content?.attachments;
  if (message.type === 'html' && attachments) {
    if (message.resourceCache === undefined) {
      message.resourceCache = {};
    }
    for (const attachment of attachments) {
      if (attachment.previewUrl) {
        const previewUrl = attachment.previewUrl;
        try {
          const src = await fetchImageSource(previewUrl, credential);
          message.resourceCache[previewUrl] = src;
        } catch (error) {
          throw new ResourceDownloadError(message);
        }
      }
    }
  }

  return message;
};
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * @private
 */
export const fetchImageSource = async (src: string, credential: CommunicationTokenCredential): Promise<string> => {
  async function fetchWithAuthentication(url: string, token: string): Promise<Response> {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    try {
      return await fetch(url, { headers });
    } catch (err) {
      throw new ChatError('ChatThreadClient.getMessage', err as Error);
    }
  }
  const accessToken = await credential.getToken();
  const response = await fetchWithAuthentication(src, accessToken.token);
  const blob = await response.blob();
  return URL.createObjectURL(blob);
};
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
interface ImageRequest {
  (request: string, credential: CommunicationTokenCredential): Promise<string>;
}

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * @private
 */
export class ResourceDownloadError extends Error {
  public chatMessageWithStatus: ChatMessageWithStatus;

  constructor(chatMessageWithStatus: ChatMessageWithStatus) {
    super();
    this.chatMessageWithStatus = chatMessageWithStatus;
  }
}
