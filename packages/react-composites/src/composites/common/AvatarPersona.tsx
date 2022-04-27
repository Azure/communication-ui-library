// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPersonaProps, Persona, PersonaInitialsColor } from '@fluentui/react';
import React, { useEffect, useMemo } from 'react';

/**
 * Custom data attributes for displaying avatar for a user.
 *
 * @public
 */
export type AvatarPersonaData = {
  /**
   * Primary text to display, usually the name of the person.
   */
  text?: string;
  /**
   * Image URL to use, should be a square aspect ratio and big enough to fit in the image area.
   */
  imageUrl?: string;
  /**
   * The user's initials to display in the image area when there is no image.
   * @defaultvalue Derived from `text`
   */
  imageInitials?: string;
  /**
   * The background color when the user's initials are displayed.
   * @defaultvalue Derived from `text`
   */
  initialsColor?: PersonaInitialsColor | string;
  /**
   * The text color when the user's initials are displayed
   * @defaultvalue `white`
   */
  initialsTextColor?: string;
};

/**
 * Callback function used to provide custom data to build an avatar for a user.
 *
 * @public
 */
export type AvatarPersonaDataCallback = (userId: string) => Promise<AvatarPersonaData>;

/**
 * @private
 */
export interface AvatarPersonaProps extends IPersonaProps {
  /**
   * Azure Communicator user ID.
   */
  userId?: string;
  /**
   * A function that returns a Promise that resolves to the data to be displayed.
   */
  dataProvider?: AvatarPersonaDataCallback;
}

/**
 * An Avatar component made using the `Persona` component.
 * It allows you to specify a `userId` and a `dataProvider` to retrieve the `AvatarPersonaData`.
 * Read more about `Persona` component at https://developer.microsoft.com/fluentui#/controls/web/persona
 *
 * @private
 */
export const AvatarPersona = (props: AvatarPersonaProps): JSX.Element => {
  const { userId, dataProvider, text, imageUrl, imageInitials, initialsColor, initialsTextColor } = props;
  const userIds = useMemo(() => {
    return [userId];
  }, [userId]);

  const [data] = useCustomAvatarPersonaData(userIds, dataProvider);

  return (
    <Persona
      {...props}
      text={data?.text ?? text}
      imageUrl={data?.imageUrl ?? imageUrl}
      imageInitials={data?.imageInitials ?? imageInitials}
      initialsColor={data?.initialsColor ?? initialsColor}
      initialsTextColor={data?.initialsTextColor ?? initialsTextColor ?? 'white'}
    />
  );
};

/**
 * Hook to override the avatar persona data of the users
 * - Calls {@link AvatarPersonaDataCallback} on each render for provided `userIds`
 * - Returns an array of the same length as `userIds`. Entries in the array may be undefined if there is no data to return.
 * @private
 */
export const useCustomAvatarPersonaData = (
  // move this to utils
  userIds: (string | undefined)[],
  callBack?: AvatarPersonaDataCallback
): (AvatarPersonaData | undefined)[] => {
  const [data, setData] = React.useState<(AvatarPersonaData | undefined)[]>([]);
  useEffect(() => {
    (async () => {
      if (callBack) {
        const newData = await Promise.all(
          userIds.map(async (userId: string | undefined) => {
            if (!userId) {
              return undefined;
            }
            return await callBack(userId);
          })
        );
        if (shouldUpdate(data, newData)) {
          setData(newData);
        }
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
const shouldUpdate = (
  currentData: (AvatarPersonaData | undefined)[],
  newData: (AvatarPersonaData | undefined)[]
): boolean => {
  let newDataPresent = false;
  if (currentData.length !== newData.length) {
    return true;
  }
  newDataPresent = avatarDeepEqual(currentData, newData);
  return newDataPresent;
};

/**
 * @private
 */
const avatarDeepEqual = (
  currentData: (AvatarPersonaData | undefined)[],
  newData: (AvatarPersonaData | undefined)[]
): boolean => {
  let newDataPresent;
  currentData.forEach((p, i) => {
    newDataPresent =
      p?.text !== newData[i]?.text &&
      p?.imageUrl !== newData[i]?.imageUrl &&
      p?.initialsColor !== newData[i]?.initialsColor &&
      p?.imageInitials !== newData[i]?.imageInitials &&
      p?.initialsTextColor !== newData[i]?.initialsTextColor
        ? true
        : false;
  });
  return newDataPresent;
};
