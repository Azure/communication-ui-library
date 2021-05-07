// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mockRemoteParticipant, mockRemoteVideoStream } from '../mocks';
import {
  convertSdkRemoteParticipantToGalleryParticipant,
  convertSdkRemoteParticipantToListParticipant
} from './TypeConverter';

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

describe('convertSdkRemoteParticipantToCallParticipant tests', () => {
  test('convertSdkRemoteParticipantToCallParticipant returns a valid ListParticipant type with unavailable videoStream', () => {
    // Arrange
    const mockVideoStream = mockRemoteVideoStream();
    const displayName = Math.random().toString();
    const mockRemoteParticipantFromSDK = mockRemoteParticipant([mockVideoStream], displayName, 'Idle', true);

    // Act
    const remoteParticipant = convertSdkRemoteParticipantToListParticipant(mockRemoteParticipantFromSDK);

    // Assert
    expect(remoteParticipant).toEqual({
      key: 'id',
      displayName: displayName,
      state: 'Idle',
      isMuted: true,
      isScreenSharing: false
    });
  });

  test('convertSdkRemoteParticipantToCallParticipant returns a valid ListParticipant type with unavailable videoStream', () => {
    // Arrange
    const mockVideoStreamActive = mockRemoteVideoStream('ScreenSharing', true);
    const displayName = Math.random().toString();
    const mockRemoteParticipantFromSDK = mockRemoteParticipant(
      [mockVideoStreamActive],
      displayName,
      'Connected',
      false
    );

    // Act
    const remoteParticipant = convertSdkRemoteParticipantToListParticipant(mockRemoteParticipantFromSDK);

    // Assert
    expect(remoteParticipant).toEqual({
      key: 'id',
      displayName: displayName,
      state: 'Connected',
      isMuted: false,
      isScreenSharing: true
    });
  });
});
