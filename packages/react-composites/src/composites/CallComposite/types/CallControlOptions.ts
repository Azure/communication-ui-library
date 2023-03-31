// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { BaseCustomStyles, ControlBarButtonStyles } from '@internal/react-components';
import { CustomCallControlButtonPlacement } from '../../common/ControlBar/CustomButton';
import { CallControlDisplayType, CommonCallControlOptions } from '../../common/types/CommonCallControlOptions';

/**
 * Customization options for the control bar in calling experience.
 *
 * @public
 */
export type CallControlOptions =
  | CommonCallControlOptions & {
      /**
       * Show, Hide or Disable participants button during a call. This is the option only work for legacyControl bar.
       * @defaultValue true
       */
      participantsButton?: boolean | { disabled: boolean };
      /* @conditional-compile-remove(new-call-control-bar) */
      legacyControlBarExperience?: boolean;
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
