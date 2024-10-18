// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { SpokenLanguageStrings, CaptionLanguageStrings } from '@internal/react-components';
import { SurveyIssues, SurveyIssuesHeadingStrings } from '@internal/react-components';
import { CapabilityChangedNotificationStrings } from './components/CapabilitiesChangedNotificationBar';
import { SpotlightPromptStrings } from './components/Prompt';

/**
 * Strings used by the {@link CallComposite} directly.
 *
 * This strings are in addition to those used by the components from the component library.
 *
 * @public
 */
export interface CallCompositeStrings {
  /**
   * Title of configuration page.
   */
  configurationPageTitle: string;
  /**
   * Optional 1-2 lines on the call details used on the configuration page.
   */
  configurationPageCallDetails?: string;
  /**
   * Text in button to start call in configuration page.
   */
  startCallButtonLabel: string;
  /**
   * Text in button to rejoin an ended call.
   */
  rejoinCallButtonLabel: string;
  /**
   * Placeholder text for local device settings dropdowns.
   */
  defaultPlaceHolder: string;
  /**
   * Label for camera dropdown.
   */
  cameraLabel: string;
  /**
   * Label for when there are no cameras present on configuration screen.
   */
  noCamerasLabel: string;
  /**
   * Label for sound dropdown.
   */
  soundLabel: string;
  /**
   * Label for when no microphones were found on the configuration screen
   */
  noMicrophonesLabel: string;
  /**
   * Label for when no speakers were found on the configuration screen.
   */
  noSpeakersLabel: string;
  /**
   * Error shown when camera access is blocked by the browser.
   */
  cameraPermissionDenied: string;
  /**
   * Error shown when the camera is turned off.
   */
  cameraTurnedOff: string;
  /**
   * Error shown when microphone access is blocked by the browser.
   */
  microphonePermissionDenied: string;
  /**
   * Title text of the page shown to the user when joining a Teams meeting fails because meeting owner denied access.
   */
  failedToJoinTeamsMeetingReasonAccessDeniedTitle: string;
  /**
   * More details text of the page shown to the user when joining a Teams meeting fails because meeting owner denied access.
   */
  failedToJoinTeamsMeetingReasonAccessDeniedMoreDetails?: string;
  /**
   * Title text of the page shown to the user when joining a call fails due to a network problem.
   */
  failedToJoinCallDueToNoNetworkTitle: string;
  /**
   * More details text of the page shown to the user when joining a call fails due to a network problem.
   */
  failedToJoinCallDueToNoNetworkMoreDetails?: string;
  /**
   * Text to display on a leaving page.
   */
  leavingCallTitle?: string;
  /**
   * Title text of the page shown to the user when they leave a call in the call composite.
   */
  leftCallTitle: string;
  /**
   * More details text of the page shown to the user when they leave a call in the call composite.
   */
  leftCallMoreDetails?: string;
  /**
   * Title text of the page shown to the user when they are removed from a call in the call composite.
   */
  removedFromCallTitle: string;
  /**
   * More details text of the page shown to the user when they are removed from a call in the call composite.
   */
  removedFromCallMoreDetails?: string;
  /**
   * Text shown to the user on the lobby screen when connecting to a call.
   */
  lobbyScreenConnectingToCallTitle: string;
  /**
   * Optional addition details shown to the user on the lobby screen when connection to a call.
   */
  lobbyScreenConnectingToCallMoreDetails?: string;
  /**
   * Text shown to the user on the lobby screen when waiting to be admitted to a call.
   */
  lobbyScreenWaitingToBeAdmittedTitle: string;
  /**
   * Optional additional details shown to the user on the lobby screen when waiting to be admitted to a call.
   */
  lobbyScreenWaitingToBeAdmittedMoreDetails?: string;
  /**
   * Message shown to the user when they are speaking while muted.
   */
  mutedMessage: string;
  /**
   * Text for link to MS privacy policy in Compliance Banner.
   */
  privacyPolicy: string;
  /**
   * Text for link to learn more about a specific subject.
   */
  learnMore: string;
  /**
   * Message to let user know the meeting is only being recorded (no transcription) in ComplianceBanner.
   */
  complianceBannerNowOnlyRecording: string;
  /**
   * Message to let user know the meeting is only being transcripted (no recording) in ComplianceBanner.
   */
  complianceBannerNowOnlyTranscription: string;
  /**
   * Message to let user know recording and transcription of the meeting are saved in ComplianceBanner.
   */
  complianceBannerRecordingAndTranscriptionSaved: string;
  /**
   * Message to let user know recording and transcription of the meeting have started in ComplianceBanner.
   */
  complianceBannerRecordingAndTranscriptionStarted: string;
  /**
   * Message to let user know recording and transcription of the meeting have stopped in ComplianceBanner.
   */
  complianceBannerRecordingAndTranscriptionStopped: string;
  /**
   * Message to let user know recording of the meeting is being saved in ComplianceBanner.
   */
  complianceBannerRecordingSaving: string;
  /**
   * Message to let user know recording of the meeting has started in ComplianceBanner.
   */
  complianceBannerRecordingStarted: string;
  /**
   * Message to let user know recording of the meeting has stopped in ComplianceBanner.
   */
  complianceBannerRecordingStopped: string;
  /**
   * Message to let user know they are giving consent to meeting being transcripted in ComplianceBanner.
   */
  complianceBannerTranscriptionConsent: string;
  /**
   * Message to let user know transcription of the meeting is being saved in ComplianceBanner.
   */
  complianceBannerTranscriptionSaving: string;
  /**
   * Message to let user know transcription of the meeting has started in ComplianceBanner.
   */
  complianceBannerTranscriptionStarted: string;
  /**
   * Message to let user know the transcription of the meeting has stopped in ComplianceBanner.
   */
  complianceBannerTranscriptionStopped: string;
  /**
   * Text for close button.
   */
  close: string;
  /**
   * Title text of the page shown to the user when there is intermittent network failure during a call.
   */
  networkReconnectTitle: string;
  /**
   * More details text of the page shown to the user when there is intermittent network failure during a call.
   */
  networkReconnectMoreDetails: string;
  /**
   * Tooltip text used to inform a user that toggling microphone in lobby is not supported.
   */
  microphoneToggleInLobbyNotAllowed: string;
  /**
   * Side pane People section Title.
   */
  peoplePaneTitle: string;
  /**
   * Aria label of more button in people pane
   */
  peoplePaneMoreButtonAriaLabel: string;
  /**
   * Aria label string for return to call back button
   */
  returnToCallButtonAriaLabel?: string;
  /**
   * Aria Description string for return to call button
   */
  returnToCallButtonAriaDescription?: string;
  /**
   * control bar People button label
   */
  peopleButtonLabel: string;
  /**
   * control bar People button label when checked
   */
  selectedPeopleButtonLabel: string;
  /**
   * control bar Chat button label.
   */
  chatButtonLabel: string;
  /**
   * Label for SidePaneHeader dismiss button
   */
  dismissSidePaneButtonLabel?: string;
  /**
   * Side pane People section subheader.
   */
  peoplePaneSubTitle?: string;
  /**
   * Label for button to copy invite link
   */
  copyInviteLinkButtonLabel?: string;
  /**
   * Label for button to copy invite link when it has been actioned
   */
  copyInviteLinkButtonActionedLabel?: string;
  /**
   * Label for button to open dialpad
   */
  openDialpadButtonLabel?: string;
  /**
   * Label for menu item to remove participant
   */
  removeMenuLabel?: string;
  /**
   * Label for menu item to start spotlight on participant
   */
  startSpotlightMenuLabel: string;
  /**
   * Label for menu item to add spotlight on participant
   */
  addSpotlightMenuLabel: string;
  /**
   * Label for menu item to stop spotlight on participant
   */
  stopSpotlightMenuLabel: string;
  /**
   * Label for menu item to stop spotlight on local user
   */
  stopSpotlightOnSelfMenuLabel: string;
  /**
   * Label for menu item to stop spotlight on local user
   */
  spotlightLimitReachedMenuTitle: string;
  /**
   * Label for menu item to stop all spotlight
   */
  stopAllSpotlightMenuLabel: string;
  /**
   * Label for add people dropdown
   */
  peoplePaneAddPeopleButtonLabel?: string;
  /**
   * Label for button to start a call
   */
  dialpadStartCallButtonLabel?: string;
  /**
   * Title for dialpad Modal
   */
  dialpadModalTitle?: string;
  /**
   * Aria Label for dialpad Modal
   */
  dialpadModalAriaLabel?: string;
  /**
   * Aria Label for dialpad Modal close button
   */
  dialpadCloseModalButtonAriaLabel?: string;
  /**
   * label for more button in the Calling composite
   */
  moreButtonCallingLabel: string;
  /**
   * Label for the resume call button on the hold pane
   */
  resumeCallButtonLabel?: string;
  /**
   * Label for the resume call button on the hold pane when call is resuming
   */
  resumingCallButtonLabel?: string;
  /**
   * Aria label for the resume call button on the hold pane
   */
  resumeCallButtonAriaLabel?: string;
  /**
   * Aria label for the resume call button on the hold pane when call is resuming
   */
  resumingCallButtonAriaLabel?: string;
  /**
   * Label for the hold pane
   */
  holdScreenLabel?: string;
  /**
   * Placeholder text for dtmf dialpad
   */
  dtmfDialpadPlaceholderText?: string;
  /**
   * Label for the button to open dtmf dialpad
   */
  openDtmfDialpadLabel?: string;
  /**
   * aria label for when the invite link has been actioned
   */
  copyInviteLinkActionedAriaLabel: string;
  /**
   * Title text of the page shown to the user when the user attempts to join a room that cannot be found.
   */
  roomNotFoundTitle: string;
  /**
   * More details text of the page shown to the user when the user attempts to join a room that cannot be found.
   */
  roomNotFoundDetails?: string;
  /**
   * Title text of the page shown to the user when the user attempts to join a room that is not valid.
   */
  roomNotValidTitle: string;
  /**
   * More details text of the page shown to the user when the user attempts to join a room that is not valid.
   */
  roomNotValidDetails?: string;
  /**
   * Title text of the page shown to the user when the user's permission to join the room is removed.
   */
  inviteToRoomRemovedTitle: string;
  /**
   * More details text of the page shown to the user when the user's permission to join the room is removed.
   */
  inviteToRoomRemovedDetails?: string;

  /**
   * Video Effects pane title.
   */
  videoEffectsPaneTitle: string;

  /**
   * Video Effects pane sub section title for choosing background.
   */
  videoEffectsPaneBackgroundSelectionTitle: string;

  /**
   * Aria label for video effects pane
   */
  videoEffectsPaneAriaLabel: string;

  /**
   * Label for the button to open effects
   */
  configurationPageVideoEffectsButtonLabel?: string;

  /**
   * Error message for video effect failure
   */
  unableToStartVideoEffect?: string;

  /**
   * Label for the blur video background effect item
   */
  blurBackgroundEffectButtonLabel?: string;

  /**
   * Tooltip text for the blur video background effect item
   */
  blurBackgroundTooltip?: string;

  /**
   * Label for the remove video background effect item
   */
  removeBackgroundEffectButtonLabel?: string;

  /**
   * Tooltip text for the blur video background effect item
   */
  removeBackgroundTooltip?: string;

  /**
   * Text to show when warning the user the camera is off and inform the user to turn the camera on to see the selected video background effect.
   */
  cameraOffBackgroundEffectWarningText?: string;
  /**
   * Title text of the page shown to the user when the user attempts to join a room they are not invited to.
   */
  notInvitedToRoomTitle: string;
  /**
   * More details text of the page shown to the user when the user attempts to join a room they are not invited to.
   */
  notInvitedToRoomDetails?: string;
  /**
   * Control bar People button ToolTipContent
   */
  peopleButtonTooltipOpen: string;
  /**
   * Control bar People button ToolTipContent
   */
  peopleButtonTooltipClose: string;
  /**
   * Label disaplayed on the lobby screen during a 1:1 outbound call.
   */
  outboundCallingNoticeString?: string;
  /**
   * Notice to be announced by narrator when a participant joins a call
   */
  participantJoinedNoticeString: string;
  /**
   * Notice to be announced by narrator when a participant joins a call
   */
  twoParticipantJoinedNoticeString: string;
  /**
   * Notice to be announced by narrator when a participant joins a call
   */
  threeParticipantJoinedNoticeString: string;
  /**
   * Notice to be announced by narrator when a participant leaves a call
   */
  participantLeftNoticeString: string;
  /**
   * Notice to be announced by narrator when 2 participants leave a call
   */
  twoParticipantLeftNoticeString: string;
  /**
   * Notice to be announced by narrator when 3 participants leave a call
   */
  threeParticipantLeftNoticeString: string;
  /**
   * string to be used to announce a change in participant if they have no displayName
   */
  unnamedParticipantString: string;
  /**
   * string to be used to announce when more than 3 participants have joined at the same time.
   */
  manyParticipantsJoined: string;
  /**
   * string to be used to announce when more than 3 participants have left at the same time.
   */
  manyParticipantsLeft: string;
  /**
   * string to be used to announce when multiple unnamed participants have joined at the same time.
   */
  manyUnnamedParticipantsJoined: string;
  /**
   * string to be used to announce when multiple unnamed participants have left at the same time.
   */
  manyUnnamedParticipantsLeft: string;
  /**
   * string to be used to open live captions contextual menu
   */
  liveCaptionsLabel?: string;
  /**
   * label for opening captions setting modal
   */
  captionsSettingsLabel?: string;
  /**
   * string to be used to start captions
   */
  startCaptionsButtonOnLabel?: string;
  /**
   * string to be used to stop captions
   */
  startCaptionsButtonOffLabel?: string;
  /**
   * tooltip string to be used to show captions is on
   */
  startCaptionsButtonTooltipOnContent?: string;
  /**
   *tooltip string to be used to show captions is off
   */
  startCaptionsButtonTooltipOffContent?: string;
  /**
   * captions setting modal title
   */
  captionsSettingsModalTitle?: string;
  /**
   * label for spoken language dropdown inside captions setting modal
   */
  captionsSettingsSpokenLanguageDropdownLabel?: string;
  /**
   * label for captions language inside captions setting modal
   */
  captionsSettingsCaptionLanguageDropdownLabel?: string;
  /**
   * text under captions setting dropdown indicating what the dropdown is for
   */
  captionsSettingsSpokenLanguageDropdownInfoText?: string;
  /**
   * text under captions setting dropdown indicating what the dropdown is for
   */
  captionsSettingsCaptionLanguageDropdownInfoText?: string;
  /**
   * confirm button label in captions setting modal
   */
  captionsSettingsConfirmButtonLabel?: string;
  /**
   * cancel button label in captions setting modal
   */
  captionsSettingsCancelButtonLabel?: string;
  /**
   * arial label for captions setting modal
   */
  captionsSettingsModalAriaLabel?: string;
  /**
   * arial label for captions setting modal close button
   */
  captionsSettingsCloseModalButtonAriaLabel?: string;
  /**
   * label for more button inside captions banner
   */
  captionsBannerMoreButtonCallingLabel?: string;
  /**
   * arial label for more button inside captions banner
   */
  captionsBannerMoreButtonTooltip?: string;
  /**
   * list of key value pairs that pairs spoken language code to language names
   */
  spokenLanguageStrings?: SpokenLanguageStrings;
  /**
   * list of key value pairs that pairs caption language code to language names
   */
  captionLanguageStrings?: CaptionLanguageStrings;
  /**
   * captions banner loading spinner label
   */
  captionsBannerSpinnerText?: string;
  /**
   * transfer page text when showing the transferor who initiated the transfer
   */
  transferPageTransferorText: string;
  /**
   * transfer page text when showing the transfer target
   */
  transferPageTransferTargetText: string;
  /**
   * transfer page display name for unknown participant
   */
  transferPageUnknownTransferorDisplayName: string;
  /**
   * transfer page display name for unknown participant
   */
  transferPageUnknownTransferTargetDisplayName: string;
  /**
   * notice to be announced by narrator the transfer page is showing
   */
  transferPageNoticeString: string;

  /**
   * Title text of the page shown to the user when target participant could not be reached
   */
  participantCouldNotBeReachedTitle?: string;

  /**
   * More details text of the page shown to the user when target participant could not be reached
   */
  participantCouldNotBeReachedMoreDetails?: string;

  /**
   * Title text of the page shown to the user when permission to reach participant is not allowed
   */
  permissionToReachTargetParticipantNotAllowedTitle?: string;

  /**
   * More details text of the page shown to the user when permission to reach participant is not allowed
   */
  permissionToReachTargetParticipantNotAllowedMoreDetails?: string;

  /**
   * Title text of the page shown to the user when tenant id for the target participant could not be resolved
   */
  unableToResolveTenantTitle?: string;

  /**
   * More details text of the page shown to the user when tenant id for the target participant could not be resolved
   */
  unableToResolveTenantMoreDetails?: string;

  /**
   * Title text of the page shown to the user when target participant id is malformed
   */
  participantIdIsMalformedTitle?: string;

  /**
   * More details text of the page shown to the user when target participant id is malformed
   */
  participantIdIsMalformedMoreDetails?: string;
  /**
   * Controls label to move the overflow gallery around
   */
  moreButtonGalleryControlLabel?: string;
  /**
   * Label for the toggle to move the overflow gallery to the top
   */
  moreButtonGalleryPositionToggleLabel?: string;
  /**
   * Label for the selection of the speaker layout
   */
  moreButtonGallerySpeakerLayoutLabel?: string;
  /**
   * Label for the selection of the default (Gallery) layout
   */
  moreButtonGalleryDefaultLayoutLabel?: string;
  /**
   * Label for the selection of the default (Gallery) layout
   */
  moreButtonLargeGalleryDefaultLayoutLabel?: string;
  /**
   * Label for the selection of the floatingLocalVideo (Dynamic) layout
   */
  moreButtonGalleryFloatingLocalLayoutLabel?: string;
  /**
   * Label for the selection of the focusedContentLayout (Focused content) layout
   */
  moreButtonGalleryFocusedContentLayoutLabel?: string;

  /**
   * All strings for capability changed notification
   */
  capabilityChangedNotification?: CapabilityChangedNotificationStrings;
  /**
   * Title for the survey
   */
  surveyTitle: string;
  /**
   * Helper text to explain what the survey is for
   */
  starSurveyHelperText: string;
  /**
   * Helper text displayed below survey question after user select one star
   */
  starSurveyOneStarText: string;
  /**
   * Helper text displayed below survey question after user select two star
   */
  starSurveyTwoStarText: string;
  /**
   * Helper text displayed below survey question after user select three star
   */
  starSurveyThreeStarText: string;
  /**
   * Helper text displayed below survey question after user select four star
   */
  starSurveyFourStarText: string;
  /**
   * Helper text displayed below survey question after user select five star
   */
  starSurveyFiveStarText: string;
  /**
   * Aria Label for each individual star rating
   */
  starRatingAriaLabel: string;
  /**
   * Tags Survey Question
   */
  tagsSurveyQuestion: string;
  /**
   * Default text for free form text field inside tags survey
   */
  tagsSurveyTextFieldDefaultText: string;
  /**
   * Tags Survey helper text
   */
  tagsSurveyHelperText: string;
  /**
   * Confirm button label for survey
   */
  surveyConfirmButtonLabel: string;
  /**
   * Cancel button label for survey
   */
  surveySkipButtonLabel: string;
  /**
   * Thank you text appeared on screen after survey is submitted
   */
  endOfSurveyText: string;
  /**
   * Corresponding texts to each call issue
   */
  surveyIssues: SurveyIssues;
  /**
   * Corresponding texts to each call category
   */
  surveyIssuesHeadingStrings: SurveyIssuesHeadingStrings;
  /**
   * String for the dismiss control on the local and remote PIP on mobile
   */
  dismissModalAriaLabel?: string;
  /**
   * String for title when the call is rejected by the callee
   */
  callRejectedTitle?: string;
  /**
   * String for more details when the call is rejected by the callee
   */
  callRejectedMoreDetails?: string;
  /**
   * String for title when the call times out because the remote user does not answer
   */
  callTimeoutTitle?: string;
  /**
   * String for title when the call times out when calling a bot.
   */
  callTimeoutBotTitle?: string;
  /**
   * String for more details when the call times out because the remote user does not answer
   */
  callTimeoutDetails?: string;
  /**
   * String for more details when the call times out when calling a bot
   */
  callTimeoutBotDetails?: string;
  /**
   * Label for the control bar button to show the dtmf dialer when the more button is disabled
   */
  dtmfDialerButtonLabel?: string;
  /**
   * Tooltip for the control bar button to show the dtmf dialer when the more button is disabled
   */
  dtmfDialerButtonTooltipOn?: string;
  /**
   * Tooltip for the control bar button to hide the dtmf dialer when the more button is disabled
   */
  dtmfDialerButtonTooltipOff?: string;
  /**
   * Label to show the dtmf dialer in the more button menu
   */
  dtmfDialerMoreButtonLabelOn?: string;
  /**
   * Label to hide the dtmf dialer in the more button menu
   */
  dtmfDialerMoreButtonLabelOff?: string;
  /**
   * Strings for spotlight prompt
   */
  spotlightPrompt: SpotlightPromptStrings;
  /**
   * Label for button to exit spotlight
   */
  exitSpotlightButtonLabel: string;
  /**
   * Tooltip for button to exit spotlight
   */
  exitSpotlightButtonTooltip: string;
  /**
   * Label for confirm button of hang up for everyone dialog
   */
  leaveConfirmButtonLabel?: string;
  /**
   * Label for confirm button of leave confim dialog
   */
  endCallConfirmButtonLabel?: string;
  /**
   * Label for cancel button in hang up confirm dialog
   */
  hangUpCancelButtonLabel?: string;
  /**
   * Title of confirm dialog when leaving
   */
  leaveConfirmDialogTitle?: string;
  /**
   * Content of confirm dialog when leaving
   */
  leaveConfirmDialogContent?: string;
  /**
   * Title of confirm dialog when leaving
   */
  endCallConfirmDialogTitle?: string;
  /**
   * Content of confirm dialog when leaving
   */
  endCallConfirmDialogContent?: string;
  /**
   * Error message when the meeting identifier or passcode is invalid
   */
  invalidMeetingIdentifier: string;
  /**
   * Menu text shown in Participant Item contextual menu for pinning a remote participant's video tile
   *
   */
  pinParticipantMenuLabel: string;
  /**
   * Menu text shown in Participant Item contextual menu when pinning limit is reached
   *
   */
  pinParticipantLimitReachedMenuLabel: string;
  /**
   * Menu text shown in Participant Item contextual menu for unpinning a remote participant's video tile
   *
   */
  unpinParticipantMenuLabel: string;
  /**
   * Aria label for unpin participant menu item of remote participant
   */
  unpinParticipantMenuItemAriaLabel: string;
  /**
   * Aria label to announce when remote participant is pinned
   */
  pinParticipantMenuItemAriaLabel: string;
  /**
   * Error message when the meeting identifier or passcode is invalid
   */
  phoneCallMoreButtonLabel: string;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Label for mute all remote participants menu item in People Pane
   */
  muteAllMenuLabel: string;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Label for mute all prompt title
   */
  muteAllDialogTitle: string;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Label for mute all prompt content
   */
  muteAllDialogContent: string;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Label for mute all confirm button
   */
  muteAllConfirmButtonLabel: string;
  /* @conditional-compile-remove(soft-mute) */
  /**
   * Label for mute all cancel button
   */
  muteAllCancelButtonLabel: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Label for join breakout room button
   */
  joinBreakoutRoomButtonLabel: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Label for button to return from breakout room
   */
  returnFromBreakoutRoomButtonLabel: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Label for button to leave breakout room and meeting
   */
  leaveBreakoutRoomAndMeetingButtonLabel: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Notification title for when a user joins a breakout room
   */
  breakoutRoomJoinedNotificationTitle: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Title for banner to join the assigned breakout room. The banner is shown in mobile view instead of the
   * notification.
   */
  joinBreakoutRoomBannerTitle: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Label for button in banner to join breakout room. The banner is shown in mobile view instead of the notification.
   */
  joinBreakoutRoomBannerButtonLabel: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Title for banner to return from breakout room. The banner is shown in mobile view instead of the notification.
   */
  returnFromBreakoutRoomBannerTitle: string;
  /* @conditional-compile-remove(breakout-rooms) */
  /**
   * Label for button in banner to return from breakout room. The banner is shown in mobile view instead of the
   * notification.
   */
  returnFromBreakoutRoomBannerButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  forbidParticipantAudioMenuLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitParticipantAudioMenuLabel: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesAudioDialogTitle: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesAudioDialogContent: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesAudioConfirmButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesAudioCancelButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesAudioDialogTitle: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesAudioDialogContent: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesAudioConfirmButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesAudioCancelButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesAudioMenuLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesAudioMenuLabel: string;

  /* @conditional-compile-remove(media-access) */
  forbidParticipantVideoMenuLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitParticipantVideoMenuLabel: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesVideoDialogTitle: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesVideoDialogContent: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesVideoConfirmButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesVideoCancelButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesVideoDialogTitle: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesVideoDialogContent: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesVideoConfirmButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesVideoCancelButtonLabel: string;
  /* @conditional-compile-remove(media-access) */
  forbidAllAttendeesVideoMenuLabel: string;
  /* @conditional-compile-remove(media-access) */
  permitAllAttendeesVideoMenuLabel: string;
}
