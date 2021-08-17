// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { IPersonaStyleProps, IPersonaStyles, IStyleFunctionOrObject, PersonaPresence } from '@fluentui/react';

/**
 * A custom rendered callback that allows users to customize the rendering of a Persona Component.
 * @param {string} userId - The Azure Communication Services ID of the user whose Persona is being rendered.
 * @param {object} options - Default Persona options such as `size`.
 */
export type OnRenderAvatarType = (
  userId?: string,
  options?: {
    hidePersonaDetails?: boolean;
    initialsTextColor?: string;
    presence?: PersonaPresence;
    size?: number;
    coinSize?: number;
    text?: string;
    styles?: IStyleFunctionOrObject<IPersonaStyleProps, IPersonaStyles>;
  }
) => JSX.Element;
