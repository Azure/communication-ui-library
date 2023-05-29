// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BaseCustomStyles, ControlBarButtonStyles } from '@internal/react-components';
import { CustomCallControlButtonPlacement } from '../ControlBar/CustomButton';
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
  endCallButton?: boolean;
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
  /* @conditional-compile-remove(PSTN-calls) */
  /* @conditional-compile-remove(one-to-n-calling) */
  /**
   * Show, Hide or disable the more button during a call.
   * @defaultValue true
   */
  moreButton?: boolean;
  /* @conditional-compile-remove(control-bar-button-injection) */
  /**
   * Inject custom buttons in the call controls.
   *
   * @beta
   */
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[];
  /* @conditional-compile-remove(PSTN-calls) */ /* @conditional-compile-remove(one-to-n-calling) */
  holdButton?: boolean | { disabled: boolean };
  /**
   * Show or hide the people button in the composite control bar.
   * @defaultValue true
   */
  peopleButton?: boolean | /* @conditional-compile-remove(PSTN-calls) */ { disabled: boolean };
};

/**
 * While the public API for the custom buttons is in beta. Use this type to access the internal
 * API.
 * @internal
 */
export type _CommonCallControlOptions = CommonCallControlOptions & {
  onFetchCustomButtonProps?: CustomCallControlButtonCallback[];
};

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
 * Includes the base props necessary to render a {@link ControlBarButton} or {@link DrawerMenuItem}.
 *
 * @beta
 */
export interface CustomControlButtonProps {
  /**
   * Calback for when button is clicked
   */
  onItemClick?: () => void;
  /**
   * Whether the buttons is disabled
   */
  disabled?: boolean;
  /**
   * Whether the label is displayed or not.
   *
   * @defaultValue `false`
   */
  showLabel?: boolean;
  /**
   * Fluent styles, common to all {@link ControlBarButton}s or {@link DrawerMenuItem}s.
   */
  styles?: ControlBarButtonStyles | BaseCustomStyles;
  /**
   * Optional label for the button
   */
  text?: string;
  /**
   * A unique key for the button
   */
  key?: string | number;
  /**
   * The aria label of the button for the benefit of screen readers.
   */
  ariaLabel?: string;
  /**
   * Detailed description of the button for the benefit of screen readers.
   */
  ariaDescription?: string;
  /**
   * A unique id set for the standard HTML id attibute
   */
  id?: string;
}

/**
 * Response from {@link CustomCallControlButtonCallback}.
 *
 * Includes the placement prop necessary to indicate where to place the
 * {@link ControlBarButton} and a {@link DrawerMenuItem}
 *
 * @beta
 */
export interface CustomCallControlButtonProps extends CustomControlButtonProps {
  /**
   * Where to place the custom button relative to other buttons.
   */
  placement: CustomCallControlButtonPlacement;
  /**
   * Icon to render. Icon is a non-default icon name that needs to be registered as a
   * custom icon using registerIcons through fluentui. Examples include icons from the fluentui library
   */
  iconName?: string;
}
