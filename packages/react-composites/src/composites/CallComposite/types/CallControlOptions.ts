// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ControlBarButtonProps } from '@internal/react-components';

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
export type CallControlOptions = {
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
  cameraButton?: boolean;
  /**
   * Show or Hide EndCall button during a call.
   * @defaultValue true
   */
  endCallButton?: boolean;
  /**
   * Show or Hide Microphone button during a call.
   * @defaultValue true
   */
  microphoneButton?: boolean;
  /**
   * Show or Hide Devices button during a call.
   * @defaultValue true
   */
  devicesButton?: boolean;
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
  /* @conditional-compile-remove(control-bar-button-injection) */
  /**
   * Inject custom buttons in the call controls.
   *
   * @beta
   */
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[];
};

/**
 * Placement for a custom button injected in the {@link CallControls} and {@link CallWithChatControlBar}.
 *
 * 'primary': Place the button(s) on the right end of the center control bar but before the EndCallButton (left end in rtl mode).
 * 'overflow': Place the buttons(s) on the end of the overflow Menu.
 * 'secondary': Place the button(s) on the left end of the side control bar (right in rtl mode).
 *
 * Multiple buttons assigned the same placement are appended in order.
 * E.g., if two buttons are placed in 'secondary', they'll both appear on the left end (right end in rtl mode)
 * in the order provided.
 *
 * @beta
 */
export type CustomCallControlButtonPlacement = 'primary' | 'overflow' | 'secondary';

/**
 * A callback that returns the props to render a custom {@link ControlBarButton}.
 *
 * The response indicates where the custom button should be placed.
 *
 * Performance tip: This callback is only called when either the callback or its arguments change.
 *
 * @beta
 */
export type CustomCallControlButtonCallback = (
  args: CustomCallControlButtonCallbackArgs
) => CustomCallControlButtonProps;

/**
 * Arguments for {@link CustomCallControlButtonCallback}.
 *
 * @beta
 */
export interface CustomCallControlButtonCallbackArgs {
  /**
   * Buttons should reduce the size to fit a smaller viewport when `displayType` is `'compact'`.
   *
   * @defaultValue `'default'`
   */
  displayType?: CallControlDisplayType;
}

/**
 * Response from {@link CustomCallControlButtonCallback}.
 *
 * Includes the props necessary to render a {@link  ControlBarButton} and indication of where to place the button.
 *
 * @beta
 */
export interface CustomCallControlButtonProps extends ControlBarButtonProps {
  /**
   * Where to place the custom button relative to other buttons.
   */
  placement: CustomCallControlButtonPlacement;
}
