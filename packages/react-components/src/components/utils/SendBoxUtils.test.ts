// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.
import { isMessageTooLong, sanitizeText, MAXIMUM_LENGTH_OF_MESSAGE } from './SendBoxUtils';
/* @conditional-compile-remove(file-sharing-acs) */
import { hasIncompleteAttachmentUploads, isAttachmentUploadCompleted } from './SendBoxUtils';

/* @conditional-compile-remove(file-sharing-acs) */
describe('SendBoxUtils hasIncompleteAttachmentUploads tests', () => {
  test('hasIncompleteAttachmentUploads should return false when progress property set to undefined', () => {
    const attachments = [
      {
        id: 'id1',
        name: 'Image1'
      }
    ];
    const result = hasIncompleteAttachmentUploads(attachments);
    expect(result).toEqual(true);
  });

  test('hasIncompleteAttachmentUploads should return true when there are at least one incomplete attachment upload', () => {
    const attachments = [
      {
        id: 'id1',
        name: 'Image1',
        progress: 0.5
      },
      {
        id: 'id2',
        name: 'Image2',
        progress: 1
      }
    ];
    const result = hasIncompleteAttachmentUploads(attachments);
    expect(result).toEqual(true);
  });

  test('hasIncompleteAttachmentUploads should return false when all attachments are complete', () => {
    const attachments = [
      {
        id: 'id1',
        name: 'Image1',
        progress: 1
      },
      {
        id: 'id2',
        name: 'Image2',
        progress: 1
      }
    ];
    const result = hasIncompleteAttachmentUploads(attachments);
    expect(result).toEqual(false);
  });

  test('hasIncompleteAttachmentUploads should return false when there are no attachments', () => {
    const result = hasIncompleteAttachmentUploads([]);
    expect(result).toEqual(false);
  });

  test('hasIncompleteAttachmentUploads should return false when at least 1 attachment has an error', () => {
    const attachments = [
      {
        id: 'id1',
        name: 'Image1',
        progress: 0,
        error: { message: 'Upload failed' }
      },
      {
        id: 'id2',
        name: 'Image2',
        progress: 1
      }
    ];
    const result = hasIncompleteAttachmentUploads(attachments);
    expect(result).toEqual(false);
  });
});

/* @conditional-compile-remove(file-sharing-acs) */
describe('SendBoxUtils hasCompletedAttachmentUploads tests', () => {
  test('hasCompletedAttachmentUploads should return true when all attachments are complete', () => {
    const attachments = [
      {
        id: 'id1',
        name: 'Image1',
        progress: 1
      },
      {
        id: 'id2',
        name: 'Image2',
        progress: 1
      }
    ];
    const result = isAttachmentUploadCompleted(attachments);
    expect(result).toEqual(true);
  });

  test('hasCompletedAttachmentUploads should return true even when there is an attachment with an error', () => {
    const attachments = [
      {
        id: 'id1',
        name: 'Image1',
        progress: 0,
        error: { message: 'Upload failed' }
      },
      {
        id: 'id2',
        name: 'Image2',
        progress: 1
      }
    ];
    const result = isAttachmentUploadCompleted(attachments);
    expect(result).toEqual(true);
  });

  test('hasCompletedAttachmentUploads should return false when there are no attachments', () => {
    const result = isAttachmentUploadCompleted([]);
    expect(result).toEqual(false);
  });

  test('hasCompletedAttachmentUploads should return false when attachments is undefined', () => {
    const result = isAttachmentUploadCompleted(undefined);
    expect(result).toEqual(false);
  });
});

describe('SendBoxUtils isMessageTooLong tests', () => {
  test('isMessageTooLong should return true when valueLength is greater than MAXIMUM_LENGTH_OF_MESSAGE', () => {
    const result = isMessageTooLong(MAXIMUM_LENGTH_OF_MESSAGE + 1);
    expect(result).toEqual(true);
  });

  test('isMessageTooLong should return false when valueLength is equal to MAXIMUM_LENGTH_OF_MESSAGE', () => {
    const result = isMessageTooLong(MAXIMUM_LENGTH_OF_MESSAGE);
    expect(result).toEqual(false);
  });

  test('isMessageTooLong should return false when valueLength is less than MAXIMUM_LENGTH_OF_MESSAGE', () => {
    const result = isMessageTooLong(50);
    expect(result).toEqual(false);
  });
});

describe('SendBoxUtils sanitizeText tests', () => {
  test('sanitizeText should return an empty string when the message is empty', () => {
    const message = '';
    const result = sanitizeText(message);
    expect(result).toEqual(message);
  });

  test('sanitizeText should return the message when it is not empty', () => {
    const message = 'Hello, world!';
    const result = sanitizeText(message);
    expect(result).toEqual(message);
  });

  test('sanitizeText should return an empty string when the message contains only whitespace', () => {
    const message = '   ';
    const result = sanitizeText(message);
    expect(result).toEqual('');
  });

  test('sanitizeText should return the message when it contains non-empty whitespace characters', () => {
    const message = '  Hello, world!  ';
    const result = sanitizeText(message);
    expect(result).toEqual(message);
  });
});
