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
  peopleButtonTooltipOpen: string;
  /**
   * {@link CallWithChatComposite} control bar People button ToolTipContent
   */
  peopleButtonTooltipClose: string;
  /**
   * {@link CallWithChatComposite} control bar Chat button label.
   */
  chatButtonLabel: string;
  /**
   * {@Link CallWithChatComposite} control bar Chat button ToolTipContent.
   */
  chatButtonTooltipOpen: string;
  /**
   * {@Link CallWithChatComposite} control bar Chat button ToolTipContent.
   */
  chatButtonTooltipClose: string;
  /**
   * {@link CallWithChatComposite} control bar Chat button enhanced tooltip string.
   */
  chatButtonTooltipClosedWithMessageCount: string;
  /**
   * Title for the audio device selection sub-menu in more button drawer.
   *
   * Only used with `mobileView` set to `true` and when no speakers are available.
   */
  moreDrawerAudioDeviceMenuTitle?: string;
  /**
   * Title for the microphone selection sub-menu in more button drawer.
   *
   * Only used with `mobileView` set to `true` and when speakers are available.
   */
  moreDrawerMicrophoneMenuTitle: string;
  /**
   * Title for the speaker selection sub-menu in more button drawer.
   *
   * Only used with `mobileView` set to `true`.
   */
  moreDrawerSpeakerMenuTitle: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * Title for the captions sub-menu in more button drawer.
   *
   * Only used with `mobileView` set to `true`.
   */
  moreDrawerCaptionsMenuTitle: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * Title for the spoken language sub-menu in more button drawer.
   *
   * Only used with `mobileView` set to `true`.
   */
  moreDrawerSpokenLanguageMenuTitle: string;
  /**
   * {@Link CallWithChatComposite} control bar More button label
   */
  moreDrawerButtonLabel: string;
  /**
   * {@Link CallWithChatComposite} control bar More button tooltip content
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
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for button to open dialpad
   */
  openDialpadButtonLabel: string;
  /**
   * Label for SidePaneHeader dismiss button
   */
  dismissSidePaneButtonLabel?: string;
  /**
   * Aria Description string for return to call button
   */
  returnToCallButtonAriaDescription?: string;
  /**
   * Aria label string for return to call back button
   */
  returnToCallButtonAriaLabel?: string;

  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for add people dropdown
   */
  peoplePaneAddPeopleButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for button to start a call
   */
  dialpadStartCallButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Title for dialpad Modal
   */
  dialpadModalTitle: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Aria Label for dialpad Modal
   */
  dialpadModalAriaLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Aria Label for dialpad Modal close button
   */
  dialpadCloseModalButtonAriaLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Placeholder text for dtmf dialpad
   */
  dtmfDialpadPlaceholderText: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for the button to open dtmf dialpad
   */
  openDtmfDialpadLabel: string;
  /**
   * aria label for when the invite link has been actioned
   */
  copyInviteLinkActionedAriaLabel: string;
}
