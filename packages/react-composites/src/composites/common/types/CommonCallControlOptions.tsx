// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { CustomCallControlButtonCallback } from '../ControlBar/CustomButton';

/**
 * Control bar display type for {@link CallComposite}.
 *
 * @public
 */
export type CallControlDisplayType = 'default' | 'compact';

/**
 * Customization options for the control bar in calling experience.
 *
 * @public
 */
export type CommonCallControlOptions = {
  /**
   * {@link CallControlDisplayType} to change how the call controls are displayed.
   * `'compact'` display type will decreases the size of buttons and hide the labels.
   *
   * @remarks
   * If the composite `formFactor` is set to `'mobile'`, the control bar will always use compact view.
   *
   * @defaultValue 'default'
   */
  displayType?: CallControlDisplayType;
  /**
   * Show or Hide Camera Button during a call
   * @defaultValue true
   */
  cameraButton?:
    | boolean
    | /* @conditional-compile-remove(PSTN-calls) */ {
        disabled: boolean;
      };
  /**
   * Show or Hide EndCall button during a call.
   * @defaultValue true
   */
  endCallButton?:
    | boolean
    | /* @conditional-compile-remove(end-call-options) */ {
        /**
         * whether to make end call button to trigger a menu, which will enable end call for everybody functionality.
         * @defaultValue false
         */
        hangUpForEveryone?: false | 'endCallOptions';
        /**
         * Wether to disable the end call confirmation modal.
         */
        disableEndCallModal?: boolean;
      };
  /**
   * Show or Hide Microphone button during a call.
   * @defaultValue true
   */
  microphoneButton?:
    | boolean
    | /* @conditional-compile-remove(PSTN-calls) */ {
        disabled: boolean;
      };
  /**
   * Show or Hide Devices button during a call.
   * @defaultValue true
   */
  devicesButton?:
    | boolean
    | /* @conditional-compile-remove(PSTN-calls) */ {
        disabled: boolean;
      };
  /**
   * Show, Hide or Disable participants button during a call.
   * @defaultValue true
   */
  participantsButton?: boolean | { disabled: boolean };
  /**
   * Show, Hide or Disable the screen share button during a call.
   * @defaultValue true
   */
  screenShareButton?: boolean | { disabled: boolean };
  /**
   * Show, Hide or disable the more button during a call.
   * @defaultValue true
   */
  moreButton?: boolean;
  /**
   * Show, Hide or Disable the screen share button during a call.
   * @defaultValue true
   */
  raiseHandButton?: boolean | { disabled: boolean };
  /**
   * Show, Hide or Disable the reaction button during a call.
   * @defaultValue true
   */
  reactionButton?: boolean | { disabled: boolean };
  /**
   * Inject custom buttons in the call controls.
   */
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[];
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  holdButton?: boolean | { disabled: boolean };
  /**
   * Show or hide the people button in the composite control bar.
   * @defaultValue true
   */
  peopleButton?: boolean | /* @conditional-compile-remove(PSTN-calls) */ { disabled: boolean };
  /**
   * Show or hide the dialpad button in the composite control bar.
   */
  dtmfDialerButton?: boolean | { disabled: boolean };
  /**
   * Show or hide the exit spotlight button in the composite control bar when local participant is spotlighted.
   */
  exitSpotlightButton?: boolean;
  /* @conditional-compile-remove(acs-close-captions) */
  /**
   * Show, Hide or Disable captions during a call.
   * @defaultValue true
   */
  captionsButton?: boolean;
  /* @conditional-compile-remove(teams-meeting-conference) */
  /**
   * Show, meeting conference phone information.
   * @defaultValue true
   */
  teamsMeetingPhoneCallButton?: boolean;
};
