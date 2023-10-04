// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ComponentIcons } from '@internal/react-components';
import { CallCompositeIcons, CallWithChatCompositeIcons, ChatCompositeIcons, COMPOSITE_ONLY_ICONS } from './icons';

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

/** @private */
export const ensureCallWithChatCompositeIconsListKnownIcons = (
  icons: Required<AllKnownCompositeIcons>
): Required<CallWithChatCompositeIcons> => icons;
