// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
const fetchBlobData = async (
  resource: string | URL | Request,
  options: { timeout?: number; headers?: Headers; abortController: AbortController }
): Promise<Response> => {
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
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @private
 */
export const getInlineImageData = async (image: string): Promise<Blob | undefined> => {
  const blobImage: Blob | undefined = undefined;
  if (image.startsWith('blob') || image.startsWith('http')) {
    const res = await fetchBlobData(image, { abortController: new AbortController() });
    const blobImage = await res.blob();
    return blobImage;
  }
  return blobImage;
};

/* @conditional-compile-remove(rich-text-editor-image-upload) */
/**
 * @internal
 * Exported only for unit testing
 */
export const removeImageTags = (event: { content: DocumentFragment }): void => {
  event.content.querySelectorAll('img').forEach((image) => {
    // If the image is the only child of its parent, remove all the parents of this img element.
    let parentNode: HTMLElement | null = image.parentElement;
    let currentNode: HTMLElement = image;
    while (parentNode?.childNodes.length === 1) {
      currentNode = parentNode;
      parentNode = parentNode.parentElement;
    }
    currentNode?.remove();
  });
};
