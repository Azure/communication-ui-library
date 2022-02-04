// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Strings used by the {@link MeetingComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 *
 * @public
 */
export interface MeetingCompositeStrings {
  /**
   * Meeting Control bar People button label
   */
  peopleButtonLabel: string;
  /**
   * Meeting Control bar Chat button label.
   */
  chatButtonLabel: string;
  /**
   * Side pane People section Title.
   */
  peoplePaneTitle: string;
  /**
   * Side pane People section subheader.
   */
  peoplePaneSubTitle: string;
  /**
   * Side pane Chat screen title.
   */
  chatPaneTitle: string;
  /**
   * Aria label for the picture in picture in picture tile that.
   * This feature currently only shows on mobileView when the chat or people pane is expanded.
   * @remarks
   * This component displays the local and most-dominant remote participant and when clicked
   * returns the user to the call screen.
   */
  pictureInPictureTileAriaLabel: string;
}
