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
  /* @conditional-compile-remove-from(stable): custom button injection */
  /**
   * Inject custom buttons in the call controls.
   *
   * @beta
   */
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[];
};

/**
 * Placement for a custom button injected in the {@link CallControls}.
 *
 * 'first': Place the button on the left end (right end in rtl mode).
 * 'afterCameraButton': Place the button on the right (left in rtl mode) of the camera button.
 * ... and so on.
 *
 * It is an error to place the button in reference to another button that has
 * been hidden via a {@link CallControlOptions} field.
 *
 * Multiple buttons placed in the same position are appended in order.
 * E.g., if two buttons are placed 'first', they'll both appear on the left end (right end in rtl mode)
 * in the order provided.
 *
 * @beta
 */
export type CustomCallControlButtonPlacement =
  | 'first'
  | 'last'
  | 'afterCameraButton'
  | 'afterEndCallButton'
  | 'afterMicrophoneButton'
  | 'afterOptionsButton'
  | 'afterParticipantsButton'
  | 'afterScreenShareButton';

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
