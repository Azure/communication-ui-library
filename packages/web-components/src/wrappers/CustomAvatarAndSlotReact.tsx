import * as React from 'react';
import { createSlotWrapper, HandlerEventNameMappings, wrapElementWithTypedReact } from '../common/utils';
// eslint-disable-next-line import/extensions
import {
  CustomAvatarAndSlot,
  CustomAvatarAndSlotEventMap,
  CustomAvatarAndSlotProps
} from '../web-component/custom-avatar-event-and-slot';

// Wrap code for current component
type NameMappings = HandlerEventNameMappings<CustomAvatarAndSlotEventMap>;

const handlerToEventMapping: NameMappings = {
  onFileadded: 'fileadded',
  onUserleft: 'userleft',
  onUserjoined: 'userjoined',
  onUsersChanged: 'usersChanged'
};

export const CustomAvatarAndSlotReact = wrapElementWithTypedReact<
  CustomAvatarAndSlotProps,
  CustomAvatarAndSlot,
  CustomAvatarAndSlotEventMap
>(CustomAvatarAndSlot, handlerToEventMapping);

export const CustomSingleSlot = createSlotWrapper('single-slot');
