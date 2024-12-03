// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

/* @conditional-compile-remove(rich-text-editor-image-upload) */
import { getImageAttachmentsFromHTMLContent } from './getImageAttachmentsFromHTMLContent';

// Remove when rich-text-editor-image-upload is GA
describe('getImageAttachmentsFromHTMLContent Empty Test', () => {
  test.skip('Empty test for Conditional Compile case where no tests are included', (done) => done());
});

/* @conditional-compile-remove(rich-text-editor-image-upload) */
describe('getImageAttachmentsFromHTMLContent', () => {
  test('should return undefined if content is empty', () => {
    const result = getImageAttachmentsFromHTMLContent('');
    expect(result).toBeUndefined();
  });

  test('should return undefined if content has no images', () => {
    const content = '<p>No images here</p>';
    const result = getImageAttachmentsFromHTMLContent(content);
    expect(result).toBeUndefined();
  });

  test('should return an array of image attachments with correct ids if content has images', () => {
    const content = '<img id="image1" src="image1.png"><img id="image2" src="image2.png">';
    const result = getImageAttachmentsFromHTMLContent(content);
    expect(result).toEqual([
      { id: 'image1', attachmentType: 'image' },
      { id: 'image2', attachmentType: 'image' }
    ]);
  });

  test('should handle content with mixed elements', () => {
    const content =
      '<div><p>Text</p><img id="img1" src="img1.png"><span>More text</span><img id="img2" src="img2.png"></div>';
    const result = getImageAttachmentsFromHTMLContent(content);
    expect(result).toEqual([
      { id: 'img1', attachmentType: 'image' },
      { id: 'img2', attachmentType: 'image' }
    ]);
  });
});
