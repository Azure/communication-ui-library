// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { AvatarPersonaData } from './AvatarPersona';
import { avatarDeepDifferenceCheck } from './CustomDataModelUtils';

const testAvatar1: AvatarPersonaData = {
  text: 'apples',
  imageUrl: 'test1',
  imageInitials: 'aa',
  initialsColor: 'white',
  initialsTextColor: 'blue'
};

const testAvatar2: AvatarPersonaData = {
  text: 'Saint James',
  imageUrl: 'test3',
  imageInitials: 'aa',
  initialsColor: 'black',
  initialsTextColor: 'blue'
};

const testAvatar3: AvatarPersonaData = {
  text: undefined,
  imageUrl: undefined,
  imageInitials: undefined,
  initialsColor: undefined,
  initialsTextColor: undefined
};

describe('Custom data model utils tests', () => {
  describe('avatarDeepDifferenceCheck tests', () => {
    test('avatarDeepDifferenceCheck should return false for same avatar', () => {
      expect(avatarDeepDifferenceCheck(testAvatar1, testAvatar1)).toBe(false);
    });
    test('avatarDeepDifferenceCheck should return true for different avatars', () => {
      expect(avatarDeepDifferenceCheck(testAvatar1, testAvatar2)).toBe(true);
    });
    test('avatarDeepDifferenceCheck should return true for avatar with data and avatar with undefined data', () => {
      expect(avatarDeepDifferenceCheck(testAvatar1, testAvatar3)).toBe(true);
    });
    test('avatarDeepDifferenceCheck should return true for two undefined avatars', () => {
      expect(avatarDeepDifferenceCheck(testAvatar3, testAvatar3)).toBe(false);
    });
  });
});
