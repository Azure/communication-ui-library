// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import {
  CameraButton,
  EndCallButton,
  ErrorBar,
  MicrophoneButton,
  DevicesButton,
  ParticipantList,
  ScreenShareButton,
  VideoGallery,
  _CaptionsBanner
} from '@internal/react-components';
/* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
import { Dialpad } from '@internal/react-components';
/* @conditional-compile-remove(PSTN-calls) */
import { HoldButton } from '@internal/react-components';
import { _StartCaptionsButton } from '@internal/react-components';
import {
  CameraButtonSelector,
  cameraButtonSelector,
  MicrophoneButtonSelector,
  microphoneButtonSelector,
  DevicesButtonSelector,
  devicesButtonSelector,
  ScreenShareButtonSelector,
  screenShareButtonSelector
} from '../callControlSelectors';
/* @conditional-compile-remove(PSTN-calls) */
import { holdButtonSelector, HoldButtonSelector } from '../callControlSelectors';
import { VideoGallerySelector, videoGallerySelector } from '../videoGallerySelector';
import { ParticipantListSelector, participantListSelector } from '../participantListSelector';
import { ParticipantsButtonSelector, participantsButtonSelector } from '../participantsButtonSelector';
import { useHandlers } from './useHandlers';
import { useSelector } from './useSelector';
import { Common } from '@internal/acs-ui-common';
import { AreEqual } from '@internal/acs-ui-common';
import { ParticipantsButton } from '@internal/react-components';
import { ErrorBarSelector, errorBarSelector } from '../errorBarSelector';
import { CommonCallingHandlers } from '../handlers/createCommonHandlers';
import {
  captionsSelector,
  startCaptionsButtonSelector,
  _CaptionsSelector,
  _StartCaptionsButtonSelector
} from '../captionsSelector';

/**
 * Primary hook to get all hooks necessary for a calling Component.
 *
 * Most straightforward usage of calling components looks like:
 *
 * @example
 * ```
 *     import { ParticipantList, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <ParticipantList {...usePropsFor(ParticipantList)}/>
 *     }
 * ```
 *
 * @public
 */
export const usePropsFor = <Component extends (props: any) => JSX.Element>(
  component: Component
): GetSelector<Component> extends (props: any) => any
  ? ReturnType<GetSelector<Component>> & Common<CommonCallingHandlers, Parameters<Component>[0]>
  : undefined => {
  const selector = getSelector(component);
  const props = useSelector(selector);
  const handlers = useHandlers<Parameters<Component>[0]>(component);
  if (props !== undefined) {
    return { ...props, ...handlers } as any;
  }
  return undefined as any;
};

/**
 * A type for trivial selectors that return no data.
 *
 * Used as a default return value if {@link usePropsFor} is called for a component that requires no data.
 *
 * @public
 */
export type EmptySelector = () => Record<string, never>;

const emptySelector: EmptySelector = (): Record<string, never> => ({});

/**
 * Specific type of the selector applicable to a given Component.
 *
 * @public
 */
export type GetSelector<Component extends (props: any) => JSX.Element | undefined> = AreEqual<
  Component,
  typeof VideoGallery
> extends true
  ? VideoGallerySelector
  : AreEqual<Component, typeof DevicesButton> extends true
  ? DevicesButtonSelector
  : AreEqual<Component, typeof MicrophoneButton> extends true
  ? MicrophoneButtonSelector
  : AreEqual<Component, typeof CameraButton> extends true
  ? CameraButtonSelector
  : AreEqual<Component, typeof ScreenShareButton> extends true
  ? ScreenShareButtonSelector
  : AreEqual<Component, typeof ParticipantList> extends true
  ? ParticipantListSelector
  : AreEqual<Component, typeof ParticipantsButton> extends true
  ? ParticipantsButtonSelector
  : AreEqual<Component, typeof EndCallButton> extends true
  ? EmptySelector
  : AreEqual<Component, typeof ErrorBar> extends true
  ? ErrorBarSelector
  : AreEqual<Component, typeof Dialpad> extends true
  ? /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */ EmptySelector
  : AreEqual<Component, typeof HoldButton> extends true
  ? /* @conditional-compile-remove(PSTN-calls) */ HoldButtonSelector
  : AreEqual<Component, typeof _CaptionsBanner> extends true
  ? _CaptionsSelector
  : AreEqual<Component, typeof _StartCaptionsButton> extends true
  ? _StartCaptionsButtonSelector
  : undefined;

/**
 * Get the selector for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getSelector = <Component extends (props: any) => JSX.Element | undefined>(
  component: Component
): GetSelector<Component> => {
  /* @conditional-compile-remove(PSTN-calls) */
  if (component === HoldButton) {
    return findConditionalCompiledSelector(component);
  }
  return findSelector(component);
};

const findSelector = (component: (props: any) => JSX.Element | undefined): any => {
  /* @conditional-compile-remove(dialpad) */ /* @conditional-compile-remove(PSTN-calls) */
  // Dialpad only has handlers currently and doesn't require any props from the stateful layer so return the emptySelector
  if (component === Dialpad) {
    return emptySelector;
  }

  switch (component) {
    case VideoGallery:
      return videoGallerySelector;
    case MicrophoneButton:
      return microphoneButtonSelector;
    case CameraButton:
      return cameraButtonSelector;
    case ScreenShareButton:
      return screenShareButtonSelector;
    case DevicesButton:
      return devicesButtonSelector;
    case ParticipantList:
      return participantListSelector;
    case ParticipantsButton:
      return participantsButtonSelector;
    case EndCallButton:
      return emptySelector;
    case ErrorBar:
      return errorBarSelector;
    case _CaptionsBanner:
      return captionsSelector;
    case _StartCaptionsButton:
      return startCaptionsButtonSelector;
  }
  return undefined;
};

/* @conditional-compile-remove(PSTN-calls) */
const findConditionalCompiledSelector = (component: (props: any) => JSX.Element | undefined): any => {
  switch (component) {
    case HoldButton:
      return holdButtonSelector;
  }
};
