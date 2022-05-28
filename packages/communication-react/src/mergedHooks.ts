// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  CallingHandlers,
  CameraButtonSelector,
  DevicesButtonSelector,
  EmptySelector,
  getCallingSelector,
  GetCallingSelector,
  MicrophoneButtonSelector,
  ParticipantListSelector,
  ParticipantsButtonSelector,
  ScreenShareButtonSelector,
  useCallingHandlers,
  useCallingSelector,
  VideoGallerySelector
} from '@internal/calling-component-bindings';
import {
  ChatHandlers,
  ErrorBarSelector,
  getChatSelector,
  GetChatSelector,
  MessageThreadSelector,
  SendBoxSelector,
  TypingIndicatorSelector,
  useChatHandlers,
  useChatSelector
} from '@internal/chat-component-bindings';
import { ChatClientState } from '@internal/chat-stateful-client';
import { CallClientState } from '@internal/calling-stateful-client';
import { Common } from '@internal/acs-ui-common';
import {
  CameraButton,
  CameraButtonProps,
  DevicesButton,
  DevicesButtonProps,
  EndCallButton,
  EndCallButtonProps,
  ErrorBar,
  ErrorBarProps,
  MessageThread,
  MessageThreadProps,
  MicrophoneButton,
  MicrophoneButtonProps,
  ParticipantList,
  ParticipantListProps,
  ParticipantsButton,
  ParticipantsButtonProps,
  ScreenShareButton,
  ScreenShareButtonProps,
  SendBox,
  SendBoxProps,
  TypingIndicator,
  TypingIndicatorProps,
  VideoGallery,
  VideoGalleryProps
} from '@internal/react-components';

/**
 * Centralized state for {@link @azure/communication-calling#CallClient} or {@link @azure/communication-chat#ChatClient}.
 *
 * See also: {@link CallClientState}, {@link ChatClientState}.
 * @public
 */
export type ClientState = CallClientState & ChatClientState;

/**
 * An optimized selector that refines {@link ClientState} updates into props for React Components in this library.
 *
 * @public
 */
export type Selector = (state: ClientState, props: any) => any;

/**
 * Hook to obtain a selector for a specified component.
 *
 * Useful when implementing a custom component that utilizes the providers
 * exported from this library.
 *
 * @public
 */
export const useSelector = <ParamT extends Selector | undefined>(
  selector: ParamT,
  selectorProps?: ParamT extends Selector ? Parameters<ParamT>[1] : undefined,
  type?: 'calling' | 'chat'
): ParamT extends Selector ? ReturnType<ParamT> : undefined => {
  // Because of react hooks rules, hooks can't be conditionally called
  // We call both call and chat hooks and detect current context
  // Return undefined and skip execution when not in that context
  const callingMode = !type || type === 'calling';
  const chatMode = !type || type === 'chat';
  const callProps = useCallingSelector(callingMode ? (selector as any) : undefined, selectorProps);
  const chatProps = useChatSelector(chatMode ? (selector as any) : undefined, selectorProps);
  return callProps ?? chatProps;
};

/**
 * Helper type for {@link usePropsFor}.
 *
 * @public
 */
export type ChatReturnProps<Component extends (props: any) => JSX.Element> = GetChatSelector<Component> extends (
  state: ChatClientState,
  props: any
) => any
  ? ReturnType<GetChatSelector<Component>> & Common<ChatHandlers, Parameters<Component>[0]>
  : never;

/**
 * Helper type for {@link usePropsFor}.
 *
 * @public
 */
export type CallingReturnProps<Component extends (props: any) => JSX.Element> = GetCallingSelector<Component> extends (
  state: CallClientState,
  props: any
) => any
  ? ReturnType<GetCallingSelector<Component>> & Common<CallingHandlers, Parameters<Component>[0]>
  : never;

/**
 * Helper type for {@link usePropsFor}.
 *
 * @public
 */
export type ComponentProps<Component extends (props: any) => JSX.Element> = ChatReturnProps<Component> extends never
  ? CallingReturnProps<Component> extends never
    ? undefined
    : CallingReturnProps<Component>
  : ChatReturnProps<Component>;

/**
 * Hook to get default props for {@link SendBox}.
 *
 * @example
 * ```
 *     import { SendBox, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <SendBox {...usePropsFor(SendBox)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof SendBox,
  type?: 'chat'
): SendBoxSelector & Common<ChatHandlers, SendBoxProps>;
/**
 * Hook to get default props for {@link MessageThread}.
 *
 * @example
 * ```
 *     import { MessageThread, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <MessageThread {...usePropsFor(MessageThread)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof MessageThread,
  type?: 'chat'
): MessageThreadSelector & Common<ChatHandlers, MessageThreadProps>;
/**
 * Hook to get default props for {@link TypingIndicator}.
 *
 * @example
 * ```
 *     import { TypingIndicator, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <TypingIndicator {...usePropsFor(TypingIndicator)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof TypingIndicator,
  type?: 'chat'
): TypingIndicatorSelector & Common<ChatHandlers, TypingIndicatorProps>;
/**
 * Hook to get default props for {@link ParticipantList}.
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
 * @public
 */
export function usePropsFor<T>(
  component: typeof ParticipantList,
  type?: 'chat'
): ParticipantListSelector & Common<ChatHandlers, ParticipantListProps>;
/**
 * Hook to get default props for {@link ErrorBar}.
 *
 * @example
 * ```
 *     import { ErrorBar, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <ErrorBar {...usePropsFor(ErrorBar)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof ErrorBar,
  type?: 'chat'
): ErrorBarSelector & Common<ChatHandlers, ErrorBarProps>;
/**
 * Hook to get default props for {@link VideoGallery}.
 *
 * @example
 * ```
 *     import { VideoGallery, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <VideoGallery {...usePropsFor(VideoGallery)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof VideoGallery,
  type?: 'calling'
): VideoGallerySelector & Common<ChatHandlers, VideoGalleryProps>;
/**
 * Hook to get default props for {@link DevicesButton}.
 *
 * @example
 * ```
 *     import { DevicesButton, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <DevicesButton {...usePropsFor(DevicesButton)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof DevicesButton,
  type?: 'calling'
): DevicesButtonSelector & Common<ChatHandlers, DevicesButtonProps>;
/**
 * Hook to get default props for {@link MicrophoneButton}.
 *
 * @example
 * ```
 *     import { MicrophoneButton, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <MicrophoneButton {...usePropsFor(MicrophoneButton)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof MicrophoneButton,
  type?: 'calling'
): MicrophoneButtonSelector & Common<ChatHandlers, MicrophoneButtonProps>;
/**
 * Hook to get default props for {@link CameraButton}.
 *
 * @example
 * ```
 *     import { CameraButton, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <CameraButton {...usePropsFor(CameraButton)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof CameraButton,
  type?: 'calling'
): CameraButtonSelector & Common<ChatHandlers, CameraButtonProps>;
/**
 * Hook to get default props for {@link ScreenShareButton}.
 *
 * @example
 * ```
 *     import { ScreenShareButton, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <ScreenShareButton {...usePropsFor(ScreenShareButton)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof ScreenShareButton,
  type?: 'calling'
): ScreenShareButtonSelector & Common<ChatHandlers, ScreenShareButtonProps>;
/**
 * Hook to get default props for {@link ParticipantList}.
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
 * @public
 */
export function usePropsFor<T>(
  component: typeof ParticipantList,
  type?: 'calling'
): ParticipantListSelector & Common<ChatHandlers, ParticipantListProps>;
/**
 * Hook to get default props for {@link ParticipantButton}.
 *
 * @example
 * ```
 *     import { ParticipantsButton, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <ParticipantsButton {...usePropsFor(ParticipantsButton)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof ParticipantsButton,
  type?: 'calling'
): ParticipantsButtonSelector & Common<ChatHandlers, ParticipantsButtonProps>;
/**
 * Hook to get default props for {@link EndCallButton}.
 *
 * @example
 * ```
 *     import { EndCallButton, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <EndCallButton {...usePropsFor(EndCallButton)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof EndCallButton,
  type?: 'calling'
): EmptySelector & Common<ChatHandlers, EndCallButtonProps>;
/**
 * Hook to get default props for {@link ErrorBar}.
 *
 * @example
 * ```
 *     import { ErrorBar, usePropsFor } from '@azure/communication-react';
 *
 *     const App = (): JSX.Element => {
 *         // ... code to setup Providers ...
 *
 *         return <ErrorBar {...usePropsFor(ErrorBar)}/>
 *     }
 * ```
 * @public
 */
export function usePropsFor<T>(
  component: typeof ErrorBar,
  type?: 'calling'
): ErrorBarSelector & Common<ChatHandlers, ErrorBarProps>;
/**
 * Default implementation for {@link usePropsFor}.
 *
 * @deprecated This type signature only exists for backwards compatibility.
 *     {@link usePropsFor} is intended to be used with one of the components
 *     exported from this library.
 *
 * @public
 */
export function usePropsFor<T>(component: (props: any) => JSX.Element, type?: 'calling' | 'chat'): undefined;

// Implementation signature. Not part of function type.
export function usePropsFor<T>(component: (props: any) => JSX.Element, type?: 'calling' | 'chat'): unknown {
  const callingSelector = type === 'calling' || !type ? getCallingSelector(component) : undefined;
  const chatSelector = type === 'chat' || !type ? getChatSelector(component) : undefined;
  const callProps = useCallingSelector(callingSelector);
  const chatProps = useChatSelector(chatSelector);
  const callingHandlers = useCallingHandlers(component);
  const chatHandlers = useChatHandlers(component);

  if (chatProps) {
    if (!chatHandlers) {
      throw 'Please initialize chatClient and chatThreadClient first!';
    }
    return { ...chatProps, ...chatHandlers } as any;
  }

  if (callProps) {
    if (!callingHandlers) {
      throw 'Please initialize callClient first!';
    }
    return { ...callProps, ...callingHandlers } as any;
  }

  throw "Can't find corresponding selector for this component. Please check the supported components from Azure Communication UI Feature Component List.";
}
