// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import {
  IPersonaStyleProps,
  IPersonaStyles,
  IStyleFunctionOrObject,
  PersonaPresence,
  PersonaSize
} from '@fluentui/react';
import { ParticipantState } from '.';

/**
 * Options that can be injected into the `onRender` function for customizing an
 * Avatar (`Persona`) component.
 *
 * @public
 */
export type CustomAvatarOptions = {
  /** Persona coin size in pixels  */
  coinSize?: number;
  /** Only show Coin and Initials  */
  hidePersonaDetails?: boolean;
  /** Text color of initials inside the coin  */
  initialsTextColor?: string;
  /** Optional property to set the aria label of the video tile if there is no available stream. */
  noVideoAvailableAriaLabel?: string;
  /** User status  */
  presence?: PersonaPresence;
  /** Preset Persona Size number  */
  size?: PersonaSize;
  /** Custom style for the Avatar  */
  styles?: IStyleFunctionOrObject<IPersonaStyleProps, IPersonaStyles>;
  /** Display name to be used in Persona  */
  text?: string;
  /** State for the participant to be displayed in the defaultPlaceHolder */
  participantState?: ParticipantState;
  /**
   * If true, show the special coin for unknown persona.
   * It has '?' in place of initials, with static font and background colors
   */
  showUnknownPersonaCoin?: boolean;
};

/**
 * A custom rendered callback that allows users to customize the rendering of a Persona Component.
 *
 * @public
 */
export type OnRenderAvatarCallback = (
  /**
   * An Communication user ID.
   */
  userId?: string,
  options?: CustomAvatarOptions,
  /**
   * A default `onRender` component that can be used to render the default avatar.
   * Pass the `options` to the `onRender` component for default rendering.
   */
  defaultOnRender?: (props: CustomAvatarOptions) => JSX.Element
) => JSX.Element | undefined;
