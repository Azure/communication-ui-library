// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React, { useEffect } from 'react';
import { AvatarPersonaData, AvatarPersonaDataCallback } from './AvatarPersona';

/**
 * Hook to override the avatar persona data of the users
 * - Calls {@link AvatarPersonaDataCallback} on each render for provided `userIds`
 * - Returns an array of the same length as `userIds`. Entries in the array may be undefined if there is no data to return.
 * @private
 */
export const useCustomAvatarPersonaData = (
  userIds: (string | undefined)[],
  callback?: AvatarPersonaDataCallback
): (AvatarPersonaData | undefined)[] => {
  const [data, setData] = React.useState<(AvatarPersonaData | undefined)[]>(Array(userIds.length).fill(undefined));
  useEffect(() => {
    (async () => {
      const newData = await Promise.all(
        userIds.map(async (userId: string | undefined) => {
          if (!userId || !callback) {
            return undefined;
          }
          return await callback(userId);
        })
      );
      if (shouldUpdate(data, newData)) {
        setData(newData);
      }
    })();
  });
  return data;
};

/**
 * Function to determine if there is new user avatar data in current render pass.
 * @param currentData current set set of avatar persona data present from the custom settings from the previous render
 * @param newData new set of avatar persona data after a run of {@link useCustomAvatarPersonData}
 * @returns Boolean whether there is new avatar persona data present.
 * @private
 */
export const shouldUpdate = (
  currentData: (AvatarPersonaData | undefined)[],
  newData: (AvatarPersonaData | undefined)[]
): boolean => {
  if (currentData.length !== newData.length) {
    return true;
  }
  return currentData.some((data, i) => avatarDeepDifferenceCheck(data, newData[i]));
};

/**
 * @private
 */
export const avatarDeepDifferenceCheck = (currentData?: AvatarPersonaData, newData?: AvatarPersonaData): boolean => {
  return (
    currentData?.text !== newData?.text ||
    currentData?.imageUrl !== newData?.imageUrl ||
    currentData?.initialsColor !== newData?.initialsColor ||
    currentData?.imageInitials !== newData?.imageInitials ||
    currentData?.initialsTextColor !== newData?.initialsTextColor
  );
};
