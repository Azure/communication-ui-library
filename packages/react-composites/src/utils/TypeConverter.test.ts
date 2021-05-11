// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mockRemoteParticipant, mockRemoteVideoStream } from '../mocks';
import { convertSdkRemoteParticipantToGalleryParticipant } from './TypeConverter';

describe('convertSdkRemoteParticipantToGalleryParticipant tests', () => {
  test('convertSdkRemoteParticipantToGalleryParticipant returns a valid GalleryParticipant type with undefined videoStream', () => {
    // Arrange
    const mockRemoteParticipantFromSDK = mockRemoteParticipant();

    // Act
    const remoteParticipants = convertSdkRemoteParticipantToGalleryParticipant(mockRemoteParticipantFromSDK);

    // Assert
    expect(remoteParticipants).toEqual({
      displayName: 'displayName',
      userId: 'id',
      videoStream: undefined
    });
  });

  test('convertSdkRemoteParticipantToGalleryParticipant returns a valid GalleryParticipant type with videoStream', () => {
    // Arrange
    const mockVideoStream = mockRemoteVideoStream();
    const mockRemoteParticipantFromSDK = mockRemoteParticipant([mockVideoStream]);

    // Act
    const remoteParticipant = convertSdkRemoteParticipantToGalleryParticipant(mockRemoteParticipantFromSDK);

    // Assert
    expect(remoteParticipant).toEqual({
      displayName: 'displayName',
      userId: 'id',
      videoStream: mockVideoStream
    });
  });
});
