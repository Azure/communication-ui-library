// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  IPersonaStyleProps,
  IPersonaStyles,
  IStyleFunctionOrObject,
  PersonaPresence,
  PersonaSize
} from '@fluentui/react';
import { PlaceholderProps } from '../components/VideoTile';

/**
 * A custom rendered callback that allows users to customize the rendering of a Persona Component.
 * @param {string} userId - The Azure Communication Services ID of the user whose Persona is being rendered.
 * @param {object} options - Default Persona options such as `size`.
 */
export type OnRenderAvatarType = (
  userId?: string,
  options?: {
    /** Only show Coin and Initials  */
    hidePersonaDetails?: boolean;
    /** Text color of initials inside the coin  */
    initialsTextColor?: string;
    /** User status  */
    presence?: PersonaPresence;
    /** Preset Persona Size number  */
    size?: PersonaSize;
    /** Persona coin size in pixels  */
    coinSize?: number;
    /** Display name to be used in Persona  */
    text?: string;
    styles?: IStyleFunctionOrObject<IPersonaStyleProps, IPersonaStyles>;
  },
  /**
   * A default `onRender` component that can be used to render the default avatar.
   * Pass the `options` to the `onRender` component for default rendering.
   */
  defaultOnRender?: (props: PlaceholderProps) => JSX.Element
) => JSX.Element;
