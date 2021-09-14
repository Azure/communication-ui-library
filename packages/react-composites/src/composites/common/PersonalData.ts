// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { PersonaInitialsColor } from '@fluentui/react';

export type PersonalData = {
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
 * Callback function used to provide custom personal data obj to the composite.
 */
export type PersonalDataCallback = (userId: string) => Promise<PersonalData>;
