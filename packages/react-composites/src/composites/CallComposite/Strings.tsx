// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

/* @conditional-compile-remove(close-captions) */
import { CaptionsAvailableLanguageStrings } from '@internal/react-components';

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
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Side pane People section Title.
   */
  peoplePaneTitle: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Aria label string for return to call back button
   */
  returnToCallButtonAriaLabel?: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Aria Description string for return to call button
   */
  returnToCallButtonAriaDescription?: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * control bar People button label
   */
  peopleButtonLabel: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * control bar Chat button label.
   */
  chatButtonLabel: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for SidePaneHeader dismiss button
   */
  dismissSidePaneButtonLabel?: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Side pane People section subheader.
   */
  peoplePaneSubTitle: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for button to copy invite link
   */
  copyInviteLinkButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for button to open dialpad
   */
  openDialpadButtonLabel: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Label for menu item to remove participant
   */
  removeMenuLabel: string;
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
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */ /* @conditional-compile-remove(close-captions) */
  /**
   * label for more button in the Calling composite
   */
  moreButtonCallingLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for the resume call button on the hold pane
   */
  resumeCallButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for the resume call button on the hold pane when call is resuming
   */
  resumingCallButtonLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Aria label for the resume call button on the hold pane
   */
  resumeCallButtonAriaLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Aria label for the resume call button on the hold pane when call is resuming
   */
  resumingCallButtonAriaLabel: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label for the hold pane
   */
  holdScreenLabel: string;
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
  /* @conditional-compile-remove(rooms) */
  /**
   * Title text of the page shown to the user when the user attempts to join a room that cannot be found.
   */
  roomNotFoundTitle: string;
  /* @conditional-compile-remove(rooms) */
  /**
   * More details text of the page shown to the user when the user attempts to join a room that cannot be found.
   */
  roomNotFoundDetails?: string;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Label for the button to open effects and title of the effects
   */
  effects?: string;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Label for the blur video background effect item
   */
  blurBackgroundEffectButtonLabel?: string;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Tooltip text for the blur video background effect item
   */
  blurBackgroundTooltip?: string;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Label for the remove video background effect item
   */
  removeBackgroundEffectButtonLabel?: string;
  /* @conditional-compile-remove(video-background-effects) */
  /**
   * Tooltip text for the blur video background effect item
   */
  removeBackgroundTooltip?: string;
  /* @conditional-compile-remove(rooms) */
  /**
   * Title text of the page shown to the user when the user attempts to join a room to which they are not invited.
   */
  deniedPermissionToRoomTitle: string;
  /* @conditional-compile-remove(rooms) */
  /**
   * More details text of the page shown to the user when the user attempts to join a room to which they are not invited.
   */
  deniedPermissionToRoomDetails?: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Control bar People button ToolTipContent
   */
  peopleButtonTooltipOpen: string;
  /* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
  /**
   * Control bar People button ToolTipContent
   */
  peopleButtonTooltipClose: string;
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Label disaplayed on the lobby screen during a 1:1 outbound call.
   */
  outboundCallingNoticeString: string;
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
  /* @conditional-compile-remove(close-captions) */
  /**
   * string to be used to open live captions contextual menu
   */
  liveCaptionsLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * label for opening captions setting modal
   */
  captionsSettingsLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * string to be used to start captions
   */
  startCaptionsButtonOnLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * string to be used to stop captions
   */
  startCaptionsButtonOffLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * tooltip string to be used to show captions is on
   */
  startCaptionsButtonTooltipOnContent?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   *tooltip string to be used to show captions is off
   */
  startCaptionsButtonTooltipOffContent?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * captions setting modal title
   */
  captionsSettingsModalTitle?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * label for dropdown inside captions setting modal
   */
  captionsSettingsDropdownLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * text under captions setting dropdown indicating what the dropdown is for
   */
  captionsSettingsDropdownInfoText?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * confirm button label in captions setting modal
   */
  captionsSettingsConfirmButtonLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * cancel button label in captions setting modal
   */
  captionsSettingsCancelButtonLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * arial label for captions setting modal
   */
  captionsSettingsModalAriaLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * arial label for captions setting modal close button
   */
  captionsSettingsCloseModalButtonAriaLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * label for more button inside captions banner
   */
  captionsBannerMoreButtonCallingLabel?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * arial label for more button inside captions banner
   */
  captionsBannerMoreButtonTooltip?: string;
  /* @conditional-compile-remove(close-captions) */
  /**
   * list of key value pairs that pairs language code to language names
   */
  captionsAvailableLanguageStrings?: CaptionsAvailableLanguageStrings;
}
