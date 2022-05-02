// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AvatarPersonaData } from './AvatarPersona';
import { avatarDeepDifferenceCheck, shouldUpdate } from './CustomDataModelUtils';

const testAvatar3: AvatarPersonaData = {
  text: undefined,
  imageUrl: undefined,
  imageInitials: undefined,
  initialsColor: undefined,
  initialsTextColor: undefined
};

const testAvatarset1: AvatarPersonaData[] = [
  {
    text: 'apples',
    imageUrl: 'test1',
    imageInitials: 'aa',
    initialsColor: 'white',
    initialsTextColor: 'blue'
  },
  {
    text: 'Saint James',
    imageUrl: 'test3',
    imageInitials: 'aa',
    initialsColor: 'black',
    initialsTextColor: 'blue'
  }
];

const testAvatarset2: AvatarPersonaData[] = [
  {
    text: 'apples',
    imageUrl: 'test1',
    imageInitials: 'aa',
    initialsColor: 'white',
    initialsTextColor: 'blue'
  },
  {
    text: 'Saint James',
    imageUrl: 'test3',
    imageInitials: 'aa',
    initialsColor: 'green',
    initialsTextColor: 'blue'
  }
];

const testAvatarset3: AvatarPersonaData[] = [
  {
    text: 'apples',
    imageUrl: 'test1',
    imageInitials: 'aa',
    initialsColor: 'white',
    initialsTextColor: 'blue'
  },
  {
    text: 'Saint James',
    imageUrl: 'test3',
    imageInitials: 'aa',
    initialsColor: 'black',
    initialsTextColor: 'blue'
  },
  {
    text: 'apples',
    imageUrl: 'test1',
    imageInitials: 'aa',
    initialsColor: 'white',
    initialsTextColor: 'blue'
  }
];

describe('Custom data model utils tests', () => {
  describe('avatarDeepDifferenceCheck tests', () => {
    test('avatarDeepDifferenceCheck should return false for same avatar', () => {
      expect(avatarDeepDifferenceCheck(testAvatarset1[1], testAvatarset1[1])).toBe(false);
    });
    test('avatarDeepDifferenceCheck should return true for different avatars', () => {
      expect(avatarDeepDifferenceCheck(testAvatarset1[1], testAvatarset1[2])).toBe(true);
    });
    test('avatarDeepDifferenceCheck should return true for avatar with data and avatar with undefined data', () => {
      expect(avatarDeepDifferenceCheck(testAvatarset1[1], testAvatar3)).toBe(true);
    });
    test('avatarDeepDifferenceCheck should return true for two undefined avatars', () => {
      expect(avatarDeepDifferenceCheck(testAvatar3, testAvatar3)).toBe(false);
    });
  });

  describe('shouldUpdate tests', () => {
    test('shouldUpdate should return true with two different avatar sets', () => {
      expect(shouldUpdate(testAvatarset1, testAvatarset2)).toBe(true);
    });
    test('shouldUpdate should return false with two of the same sets of AvatarPersonaData', () => {
      expect(shouldUpdate(testAvatarset1, testAvatarset1)).toBe(false);
    });
    test('shouldUpdate should return true with two avatar sets of different lengths', () => {
      expect(shouldUpdate(testAvatarset1, testAvatarset3)).toBe(true);
    });
  });
});
