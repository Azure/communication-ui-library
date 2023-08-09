// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { CommunicationParticipant, MessageRenderer, MessageProps } from '@internal/react-components';
import React from 'react';
import { BaseProvider, BaseCompositeProps } from '../common/BaseComposite';
import { ChatCompositeIcons } from '../common/icons';
import { ChatAdapter } from './adapter/ChatAdapter';
import { ChatAdapterProvider } from './adapter/ChatAdapterProvider';
import { chatScreenContainerStyle } from './styles/Chat.styles';
import { ChatScreen } from './ChatScreen';
/* @conditional-compile-remove(file-sharing) */
import { FileSharingOptions } from './ChatScreen';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { useId } from '@fluentui/react-hooks';
/* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
import { LayerHost } from '@fluentui/react';

/**
 * Props for {@link ChatComposite}.
 *
 * @public
 */
export interface ChatCompositeProps extends BaseCompositeProps<ChatCompositeIcons> {
  /**
   * An adapter provides logic and data to the composite.
   * Composite can also be controlled using the adapter.
   */
  adapter: ChatAdapter;
  /**
   * `(messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element`
   * A callback for customizing the message renderer.
   */
  onRenderMessage?: (messageProps: MessageProps, defaultOnRender?: MessageRenderer) => JSX.Element;
  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  /**
   * Optional id property provided on a LayerHost that ImageGallery layer should render within.
   */
  modalLayerHostId?: string;
  /**
   * `(typingUsers: CommunicationParticipant[]) => JSX.Element`
   * A callback for customizing the typing indicator renderer.
   */
  onRenderTypingIndicator?: (typingUsers: CommunicationParticipant[]) => JSX.Element;
  /**
   * Flags to enable/disable visual elements of the {@link ChatComposite}.
   */
  options?: ChatCompositeOptions;
  /* @conditional-compile-remove(file-sharing) */
  /**
   * Optimizes the composite form factor for either desktop or mobile.
   * @remarks `mobile` is currently only optimized for Portrait mode on mobile devices and does not support landscape.
   * @defaultValue 'desktop'
   */
  formFactor?: 'desktop' | 'mobile';
}

/**
 * Optional features of the {@link ChatComposite}.
 *
 * @public
 */
export type ChatCompositeOptions = {
  /**
   * Surface Azure Communication Services backend errors in the UI with {@link @azure/communication-react#ErrorBar}.
   * Hide or show the error bar.
   * @defaultValue true
   */
  errorBar?: boolean;
  /* @conditional-compile-remove(chat-composite-participant-pane) */
  /**
   * Show or hide the participant pane. This feature is in beta and not supported on mobile or narrow screen views.
   * @defaultValue false
   *
   * @beta
   */
  participantPane?: boolean;
  /**
   * Show or hide the topic at the top of the chat. Hidden if set to `false`
   * @defaultValue true
   */
  topic?: boolean;
  /**
   * enumerable to determine if the input box has focus on render or not.
   * When undefined nothing has focus on render
   */
  autoFocus?: 'sendBoxTextField';

  /* @conditional-compile-remove(file-sharing) */
  /**
   * Properties for configuring the File Sharing feature.
   * If undefined, file sharing feature will be disabled.
   * @beta
   */
  fileSharing?: FileSharingOptions;
};

/**
 * A customizable UI composite for the chat experience.
 *
 * @remarks Chat composite min width and height are respectively 17.5rem and 20rem (280px and 320px, with default rem at 16px)
 *
 * @public
 */
export const ChatComposite = (props: ChatCompositeProps): JSX.Element => {
  const {
    adapter,
    options,
    onFetchAvatarPersonaData,
    onRenderTypingIndicator,
    onRenderMessage,
    onFetchParticipantMenuItems,
    /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
    modalLayerHostId
  } = props;

  const formFactor = props['formFactor'] || 'desktop';

  /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
  const chatCompositeModalLayerHostId = useId('modalLayerHost');

  /**
   * @TODO Remove this function and pass the props directly when file-sharing is promoted to stable.
   * @private
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const fileSharingOptions = () => {
    /* @conditional-compile-remove(file-sharing) */
    return {
      fileSharing: options?.fileSharing
    };
    return {};
  };

  return (
    <div className={chatScreenContainerStyle}>
      <BaseProvider {...props}>
        <ChatAdapterProvider adapter={adapter}>
          <ChatScreen
            formFactor={formFactor}
            options={options}
            onFetchAvatarPersonaData={onFetchAvatarPersonaData}
            onRenderTypingIndicator={onRenderTypingIndicator}
            onRenderMessage={onRenderMessage}
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            modalLayerHostId={props.modalLayerHostId || chatCompositeModalLayerHostId}
            onFetchParticipantMenuItems={onFetchParticipantMenuItems}
            {...fileSharingOptions()}
          />
          {
            /* @conditional-compile-remove(teams-inline-images-and-file-sharing) */
            !modalLayerHostId && <LayerHost id={chatCompositeModalLayerHostId} />
          }
        </ChatAdapterProvider>
      </BaseProvider>
    </div>
  );
};
