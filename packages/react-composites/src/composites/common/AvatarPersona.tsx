// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IPersonaProps, Persona, PersonaInitialsColor } from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import { mergeStyles } from '@fluentui/react';

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
  /**
   * If true, show the special coin for unknown persona.
   * It has '?' in place of initials, with static font and background colors
   */
  showUnknownPersonaCoin?: boolean;
};

/**
 * Callback function used to provide custom data to build an avatar for a user.
 *
 * @public
 */
export type AvatarPersonaDataCallback = (userId: string) => Promise<AvatarPersonaData | undefined>;

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
  /**
   * Allow to show colored border around persona coin, but isActive is what shows it.
   */

  allowActiveBorder?: boolean;
}

/**
 * An Avatar component made using the `Persona` component.
 * It allows you to specify a `userId` and a `dataProvider` to retrieve the `AvatarPersonaData`.
 * Read more about `Persona` component at https://developer.microsoft.com/fluentui#/controls/web/persona
 *
 * @private
 */
export const AvatarPersona = (props: AvatarPersonaProps): JSX.Element => {
  const { userId, dataProvider, text, imageUrl, imageInitials, initialsColor, initialsTextColor, showOverflowTooltip } =
    props;

  const [data, setData] = useState<AvatarPersonaData | undefined>();

  useEffect(() => {
    (async () => {
      if (dataProvider && userId) {
        const newData = await dataProvider(userId);
        if (avatarDeepDifferenceCheck(data, newData)) {
          setData(newData);
        }
      }
    })();
  }, [data, dataProvider, userId]);

  let activePersona = '';

  if (props.allowActiveBorder) {
    // Display a border for raised handed participants in participant list
    activePersona = mergeStyles({
      border: 'solid 2px',
      borderColor: 'transparent',
      borderRadius: '50%',
      padding: '2px',
      boxSizing: 'content-box',
      margin: '-4px'
    });

    mergeStyles(activePersona, props.styles);
  }

  return (
    <Persona
      {...props}
      className={activePersona}
      text={data?.text ?? text}
      imageUrl={data?.imageUrl ?? imageUrl}
      imageInitials={data?.imageInitials ?? imageInitials}
      initialsColor={data?.initialsColor ?? initialsColor}
      initialsTextColor={data?.initialsTextColor ?? initialsTextColor ?? 'white'}
      // default disable tooltip unless specified
      showOverflowTooltip={showOverflowTooltip ?? false}
      showUnknownPersonaCoin={data?.showUnknownPersonaCoin ?? props.showUnknownPersonaCoin ?? false}
    />
  );
};

const avatarDeepDifferenceCheck = (currentData?: AvatarPersonaData, newData?: AvatarPersonaData): boolean => {
  return (
    currentData?.text !== newData?.text ||
    currentData?.imageUrl !== newData?.imageUrl ||
    currentData?.initialsColor !== newData?.initialsColor ||
    currentData?.imageInitials !== newData?.imageInitials ||
    currentData?.initialsTextColor !== newData?.initialsTextColor
  );
};
