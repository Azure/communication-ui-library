// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { ComponentIcons } from '@internal/react-components';
import { CallCompositeIcons, ChatCompositeIcons, COMPOSITE_ONLY_ICONS } from './icons';
/* @conditional-compile-remove(call-with-chat-composite) */
import { CallWithChatCompositeIcons } from './icons';

/** Superset of all icons that composites can use. */
type AllKnownCompositeIcons = ComponentIcons & Record<keyof typeof COMPOSITE_ONLY_ICONS, JSX.Element>;

/** @private */
export const ensureCallCompositeIconsListKnownIcons = (
  icons: Required<AllKnownCompositeIcons>
): Required<CallCompositeIcons> => icons;

/** @private */
export const ensureChatCompositeIconsListKnownIcons = (
  icons: Required<AllKnownCompositeIcons>
): Required<ChatCompositeIcons> => icons;

/** @private
 *
 * @conditional-compile-remove(call-with-chat-composite)
 */
export const ensureCallWithChatCompositeIconsListKnownIcons = (
  icons: Required<AllKnownCompositeIcons>
): Required<CallWithChatCompositeIcons> => icons;
