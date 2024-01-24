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
  private _credential: CommunicationTokenCredential;
  private _isRequesting = false;

  constructor(context: ChatContext, credential: CommunicationTokenCredential) {
    this._context = context;
    this._credential = credential;
  }

  public isRequesting(): boolean {
    return this._isRequesting;
  }

  public containsMessage(message: ChatMessageWithStatus): boolean {
    let contains = false;
    if (this._messageQueue.includes(message)) {
      contains = true;
    }
    return contains;
  }

  public addMessage(threadId: string, message: ChatMessageWithStatus): void {
    // make a copy of message and add to queue
    const copy = { ...message };
    this._messageQueue.push(copy);

    if (!this.isRequesting()) {
      this.startQueue(threadId);
    }
  }

  private async startQueue(threadId: string): Promise<void> {
    while (this._messageQueue.length > 0) {
      const newMessage = await this.requestAttachments();
      this._isRequesting = false;
      if (newMessage) {
        this._context.setChatMessage(threadId, newMessage);
      }
    }
  }

  public async requestAttachments(): Promise<ChatMessageWithStatus | undefined> {
    if (this._messageQueue.length === 0) {
      return;
    }
    this._isRequesting = true;
    const message = this._messageQueue.shift();
    if (message) {
      const attachments = message.content?.attachments;
      if (message.type === 'html' && attachments) {
        if (message.resourceCache === undefined) {
          message.resourceCache = {};
        }
        for (const attachment of attachments) {
          if (attachment.previewUrl) {
            const previewUrl = attachment.previewUrl;
            const src = await fetchImageSource(previewUrl, this._credential);
            message.resourceCache[previewUrl] = src;
          }
        }
      }
    }
    return message;
  }
}
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
