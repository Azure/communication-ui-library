// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/**
 * Strings used by the {@link CallWithChatComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 *
 * @public
 */
export interface CallWithChatCompositeStrings {
  /**
   * {@link CallWithChatComposite} control bar People button label
   */
  peopleButtonLabel: string;
  /**
   * {@link CallWithChatComposite} control bar People button ToolTipContent
   */
  peopleButtonTooltipContentOpen: string;
  /**
   * {@link CallWithChatComposite} control bar People button ToolTipContent
   */
  peopleButtonTooltipContentClose: string;
  /**
   * {@link CallWithChatComposite} control bar Chat button label.
   */
  chatButtonLabel: string;
  /**
   * {@Link CallWithChatComposite} control bar Chat button ToolTipContent.
   */
  chatButtonTooltipContentOpen: string;
  /**
   * {@Link CallWithChatComposite} control bar Chat button ToolTipContent.
   */
  chatButtonTooltipContentClose: string;
  /**
   * Title for the microphone selection sub-menu in more buttton drawer.
   *
   * Only used with `mobileView` set to `true`.
   */
  moreDrawerMicrophoneMenuTitle: string;
  /**
   * Title for the speaker selection sub-menu in more buttton drawer.
   *
   * Only used with `mobileView` set to `true`.
   */
  moreDrawerSpeakerMenuTitle: string;
  /**
   * {@Link CallWithChatComposite} Mobile Control bar More drawer label for narrator
   */
  moreDrawerButtonLabel: string;
  /**
   * {@Link CallWithChatComposite} Mobile Control bar More drawer label for narrator
   */
  moreDrawerButtonTooltip: string;
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
   * New Message label for chat button with notification icon component.
   */
  chatButtonNewMessageNotificationLabel: string;
  /**
   * Aria label for the picture in picture in picture tile that.
   * This feature currently only shows on mobileView when the chat or people pane is expanded.
   * @remarks
   * This component displays the local and most-dominant remote participant and when clicked
   * returns the user to the call screen.
   */
  pictureInPictureTileAriaLabel: string;
  /**
   * Label for menu item to remove participant
   */
  removeMenuLabel: string;
  /**
   * Label for button to copy invite link
   */
  copyInviteLinkButtonLabel: string;
}
