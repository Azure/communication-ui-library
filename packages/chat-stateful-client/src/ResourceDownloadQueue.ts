// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatContext } from './ChatContext';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatError } from './ChatClientState';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { ChatMessageWithStatus } from './types/ChatMessageWithStatus';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { CommunicationTokenCredential } from '@azure/communication-common';

/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * @private
 */
export class ResourceDownloadQueue {
  private _messageQueue: ChatMessageWithStatus[] = [];
  private _context: ChatContext;
  private _isRequesting = false;
  private _credential: CommunicationTokenCredential;

  constructor(context: ChatContext, credential: CommunicationTokenCredential) {
    this._context = context;
    this._credential = credential;
  }

  public isRequesting(): boolean {
    return this._isRequesting;
  }

  public containsMessage(message: ChatMessageWithStatus): boolean {
    let contains = false;
    if (this._messageQueue.find((m) => m.id === message.id)) {
      contains = true;
    }
    return contains;
  }

  public addMessage(message: ChatMessageWithStatus): void {
    // make a copy of message and add to queue
    const copy = { ...message };
    this._messageQueue.push(copy);
  }

  public async startQueue(threadId: string, operation: ImageRequest): Promise<void> {
    while (this._messageQueue.length > 0) {
      this._isRequesting = true;
      const message = this._messageQueue.shift();
      if (!message) {
        this._isRequesting = false;
        continue;
      }

      try {
        const newMessage = await operation(message, this._credential);
        if (newMessage) {
          this._context.setChatMessage(threadId, newMessage);
        }
      } catch (error) {
        if (error instanceof ResourceDownloadError) {
          this.addMessage(error.chatMessageWithStatus);
        }
      }
    }
  }
}
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
/**
 * @private
 */
export const requestAttachments = async (
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
/**
 * @private
 */
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
const fetchImageSource = async (src: string, credential: CommunicationTokenCredential): Promise<string> => {
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

interface ImageRequest {
  (message: ChatMessageWithStatus, credential: CommunicationTokenCredential): Promise<ChatMessageWithStatus>;
}

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
