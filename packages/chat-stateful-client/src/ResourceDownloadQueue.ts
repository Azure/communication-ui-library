// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { ChatContext } from './ChatContext';
import { ChatMessageWithStatus, ResourceFetchResult } from './types/ChatMessageWithStatus';
import type { CommunicationTokenCredential } from '@azure/communication-common';

declare type CancellationDetails = { src: string; abortController: AbortController };
/**
 * @private
 */
export class ResourceDownloadQueue {
  private _messagesNeedingResourceRetrieval: ChatMessageWithStatus[] = [];
  private _context: ChatContext;
  private isActive = false;
  private _credential: CommunicationTokenCredential;
  private _endpoint: string;
  private _requestsToCancel: Record<string, CancellationDetails> = {};

  constructor(context: ChatContext, authentication: { credential: CommunicationTokenCredential; endpoint: string }) {
    this._context = context;
    this._credential = authentication.credential;
    this._endpoint = authentication.endpoint;
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

      if (options) {
        const singleUrl = options.singleUrl;
        message = await this.downloadSingleUrl(message, singleUrl, operation);
      } else {
        message = await this.downloadAllPreviewUrls(message, operation);
      }
      this._context.setChatMessage(threadId, message);
      this.isActive = false;
    }
  }

  public cancelAllRequests(): void {
    for (const cancelation of Object.values(this._requestsToCancel)) {
      cancelation.abortController.abort();
    }
    this._requestsToCancel = {};
  }

  public cancelRequest(url: string): void {
    if (this._requestsToCancel[url]) {
      this._requestsToCancel[url]?.abortController.abort();
      delete this._requestsToCancel[url];
    }
  }

  private async downloadSingleUrl(
    message: ChatMessageWithStatus,
    resourceUrl: string,
    operation: ImageRequest
  ): Promise<ChatMessageWithStatus> {
    const response: ResourceFetchResult = { sourceUrl: '' };
    try {
      const abortController = new AbortController();
      const blobUrl = await this.downloadResource(operation, resourceUrl, abortController);
      response.sourceUrl = blobUrl;
    } catch (error) {
      response.error = error as Error;
      delete this._requestsToCancel[resourceUrl];
    }

    message = { ...message, resourceCache: { ...message.resourceCache, [resourceUrl]: response } };
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
        if (attachment.previewUrl && attachment.attachmentType === 'image') {
          const response: ResourceFetchResult = { sourceUrl: '' };
          try {
            const abortController = new AbortController();
            const blobUrl = await this.downloadResource(operation, attachment.previewUrl, abortController);
            response.sourceUrl = blobUrl;
          } catch (error) {
            response.error = error as Error;
            delete this._requestsToCancel[attachment.previewUrl];
          }
          message.resourceCache[attachment.previewUrl] = response;
        }
      }
    }

    return message;
  }

  private async downloadResource(
    operation: ImageRequest,
    url: string,
    abortController: AbortController
  ): Promise<string> {
    this._requestsToCancel[url] = { src: url, abortController };
    const blobUrl = await operation(
      url,
      { credential: this._credential, endpoint: this._endpoint },
      { abortController }
    );
    delete this._requestsToCancel[url];
    return blobUrl;
  }
}

/**
 * @private
 */
export const fetchImageSource = async (
  src: string,
  authentication: { credential: CommunicationTokenCredential; endpoint: string },
  options: { abortController: AbortController; timeout?: number }
): Promise<string> => {
  async function fetchWithAuthentication(
    url: string,
    token: string,
    options: { abortController: AbortController; timeout?: number }
  ): Promise<Response> {
    const headers = new Headers();
    headers.append('Authorization', `Bearer ${token}`);
    return await fetchWithTimeout(url, {
      timeout: options.timeout,
      headers,
      abortController: options.abortController
    });
  }
  async function fetchWithTimeout(
    resource: string | URL | Request,
    options: { timeout?: number; headers?: Headers; abortController: AbortController }
  ): Promise<Response> {
    // default timeout is 30 seconds
    const { timeout = 30000, abortController } = options;

    const id = setTimeout(() => {
      abortController.abort();
    }, timeout);

    const response = await fetch(resource, {
      ...options,
      signal: abortController.signal
    });
    clearTimeout(id);
    return response;
  }
  const fetchUrl = new URL(src);
  const endpoint = new URL(authentication.endpoint);

  let token = '';
  if (fetchUrl.hostname === endpoint.hostname && fetchUrl.protocol === 'https:') {
    token = (await authentication.credential.getToken()).token;
  }

  const response = await fetchWithAuthentication(src, token, options);

  if (response.status >= 400) {
    throw new Error(`Failed to fetch image source. Status code: ${response.status}`);
  }

  const blob = await response.blob();

  return URL.createObjectURL(blob);
};
interface ImageRequest {
  (
    request: string,
    authentication: { credential: CommunicationTokenCredential; endpoint: string },
    options: { abortController: AbortController; timeout?: number }
  ): Promise<string>;
}
