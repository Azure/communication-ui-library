// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
/**
 * A method to fetch the attachment content, passing in authentication token into the header.
 * @internal
 */
export interface ACSAttachmentManager {
  downloadInlineAttachment: (attachmentUrl: string) => Promise<string>;
}

/**
 * @internal
 */
export class ACSAttachmentContext implements ACSAttachmentManager {
  private getAuthToken?: () => Promise<string>;

  constructor(getAuthToken?: () => Promise<string>) {
    this.getAuthToken = getAuthToken;
  }

  public async downloadInlineAttachment(attachmentUrl: string): Promise<string> {
    function fetchWithAuthentication(url: string, token: string): Promise<Response> {
      const headers = new Headers();
      headers.append('Authorization', `Bearer ${token}`);
      return fetch(url, { headers });
    }
    if (!this.getAuthToken) {
      return '';
    }
    // ToDo InlineAttachments: If GET fails might need to send failure up to contoso
    const token = await this.getAuthToken();
    const response = await fetchWithAuthentication(attachmentUrl ?? '', token);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }
}
