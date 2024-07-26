// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { removeImageTags } from './removeImageTags';

/* @conditional-compile-remove(rich-text-editor-image-upload) */
describe('removeImageElement should work correctly', () => {
  test('removeImageElement should remove all image elements when fragment only contains image children', () => {
    const fragment = document.createDocumentFragment();
    const container = fragment.appendChild(document.createElement('div'));
    const containerId = 'container';
    container.id = containerId;
    container.appendChild(document.createElement('img'));
    container.appendChild(document.createElement('img'));
    container.appendChild(document.createElement('img'));

    const event = { content: fragment };

    removeImageTags(event);
    expect(fragment.getElementById(containerId)?.outerHTML).toEqual(undefined);
  });

  test('removeImageElement should remove the image element and its parents', () => {
    const fragment = document.createDocumentFragment();
    const container = fragment.appendChild(document.createElement('div'));
    const containerId = 'container';
    container.id = containerId;
    const layer1 = container.appendChild(document.createElement('div'));
    const layer2 = layer1.appendChild(document.createElement('span'));
    const layer3 = layer2.appendChild(document.createElement('p'));
    layer3.appendChild(document.createElement('img'));
    layer3.appendChild(document.createElement('img'));

    const event = { content: fragment };

    removeImageTags(event);
    // When a message only contains an image, no content will be pasted.
    expect(fragment.getElementById(containerId)?.outerHTML).toEqual(undefined);
  });

  test('removeImageElement should NOT remove parent element if it contain non-image children', () => {
    const fragment = document.createDocumentFragment();
    const container = fragment.appendChild(document.createElement('div'));
    const containerId = 'container';
    container.id = containerId;
    container.appendChild(document.createElement('img'));
    container.appendChild(document.createElement('text'));

    const event = { content: fragment };

    removeImageTags(event);
    expect(fragment.childNodes.length).toEqual(1);
    expect(fragment.firstChild?.childNodes.length).toEqual(1);
    expect(fragment.getElementById(containerId)?.outerHTML).toEqual('<div id="container"><text></text></div>');
  });
});

test('Placeholder test to avoid empty test suite. Remove this after rich-text-editor-image-upload is stabilized', () => {});
