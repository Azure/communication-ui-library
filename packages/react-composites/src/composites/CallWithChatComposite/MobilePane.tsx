// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import {
  concatStyleSets,
  ContextualMenu,
  DefaultButton,
  IDragOptions,
  IModalStyleProps,
  IModalStyles,
  IStyleFunctionOrObject,
  Modal,
  Stack
} from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallAdapter } from '../CallComposite';
import { CallAdapterProvider } from '../CallComposite/adapter/CallAdapterProvider';
import { LocalAndRemotePIP } from '../CallComposite/components/LocalAndRemotePIP';
import { useHandlers } from '../CallComposite/hooks/useHandlers';
import { useSelector } from '../CallComposite/hooks/useSelector';
import { localAndRemotePIPSelector } from '../CallComposite/selectors/localAndRemotePIPSelector';
import { CallWithChatCompositeIcon } from '../common/icons';
import {
  paneBodyContainer,
  scrollableContainer,
  scrollableContainerContents
} from '../common/styles/ParticipantContainer.styles';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import {
  hiddenMobilePaneStyle,
  mobilePaneBackButtonStyles,
  mobilePaneButtonStyles,
  mobilePaneControlBarStyle,
  mobilePaneStyle,
  modalStyle
} from './styles/MobilePane.styles';

/**
 * Props for {@link MobilePane} component
 */
type MobilePaneProps = {
  onClose: () => void;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  children: React.ReactNode;
  hidden: boolean;
  dataUiId: string;
  activeTab: MobilePaneTab;
};

/**
 * This is a wrapper component for Chat and People pane to cover the entire the screen and to have
 * its own navigation bar
 * @private
 */
export const MobilePane = (props: MobilePaneProps): JSX.Element => {
  // We hide the mobile pane instead of not rendering the entire pane to persist certain elements
  // between renders. An example of this is composing a chat message - a chat message that has been
  // typed but not sent should not be lost if the mobile panel is closed and then reopened.
  const mobilePaneStyles = props.hidden ? hiddenMobilePaneStyle : mobilePaneStyle;
  const theme = useTheme();
  const mobilePaneButtonStylesThemed = useMemo(() => {
    return concatStyleSets(mobilePaneButtonStyles, {
      rootChecked: {
        borderBottom: `0.125rem solid ${theme.palette.themePrimary}`
      },
      label: {
        fontSize: theme.fonts.medium.fontSize,
        fontWeight: theme.fonts.medium.fontWeight
      }
    });
  }, [theme]);
  const strings = useCallWithChatCompositeStrings();

  return (
    <Stack verticalFill grow styles={mobilePaneStyles} data-ui-id={props.dataUiId}>
      <Stack horizontal grow styles={mobilePaneControlBarStyle}>
        <DefaultButton
          onClick={props.onClose}
          styles={mobilePaneBackButtonStyles}
          onRenderIcon={() => <ChevronLeftIconTrampoline />}
        ></DefaultButton>
        <DefaultButton
          onClick={props.onChatButtonClicked}
          styles={mobilePaneButtonStylesThemed}
          checked={props.activeTab === 'chat'}
        >
          {strings.chatButtonLabel}
        </DefaultButton>
        <DefaultButton
          onClick={props.onPeopleButtonClicked}
          styles={mobilePaneButtonStylesThemed}
          checked={props.activeTab === 'people'}
        >
          {strings.peopleButtonLabel}
        </DefaultButton>
      </Stack>
      <Stack.Item verticalFill grow styles={paneBodyContainer}>
        <Stack horizontal styles={scrollableContainer}>
          <Stack.Item verticalFill styles={scrollableContainerContents}>
            {props.children}
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  );
};

const ChevronLeftIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(call-with-chat-composite)
  return <CallWithChatCompositeIcon iconName="ChevronLeft" />;

  // Return _something_ in stable builds to satisfy build system
  return <CallWithChatCompositeIcon iconName="ControlButtonEndCall" />;
};

/**
 * Type used to define which tab is active in {@link MobilePane}
 */
type MobilePaneTab = 'chat' | 'people';

/**
 * Drag options for Modal
 */
const DRAG_OPTIONS: IDragOptions = {
  moveMenuItemText: 'Move',
  closeMenuItemText: 'Close',
  menu: ContextualMenu,
  keepInBounds: true
};

/**
 * Styles for {@link MobilePaneWithLocalAndRemotePIP} component
 */
export type MobilePaneWithLocalAndRemotePIPStyles = { modal?: IStyleFunctionOrObject<IModalStyleProps, IModalStyles> };

const _MobilePaneWithLocalAndRemotePIP = (
  props: MobilePaneProps & {
    modalLayerHostId: string;
    styles?: MobilePaneWithLocalAndRemotePIPStyles;
  }
): JSX.Element => {
  const mobilePaneStyles = props.hidden ? hiddenMobilePaneStyle : mobilePaneStyle;
  const pictureInPictureProps = useSelector(localAndRemotePIPSelector);
  const pictureInPictureHandlers = useHandlers(LocalAndRemotePIP);
  const localAndRemotePIP = useMemo(
    () => <LocalAndRemotePIP {...pictureInPictureProps} {...pictureInPictureHandlers} />,
    [pictureInPictureProps, pictureInPictureHandlers]
  );

  const modalStylesThemed = concatStyleSets(
    modalStyle,
    { root: {} } /* needed to bypass type error */,
    props.styles?.modal
  );

  return (
    <Stack styles={mobilePaneStyles}>
      <MobilePane {...props} />
      <Modal
        isOpen={true}
        isModeless={true}
        dragOptions={DRAG_OPTIONS}
        styles={modalStylesThemed}
        layerProps={{ hostId: props.modalLayerHostId }}
      >
        {
          // Only render LocalAndRemotePIP when this component is NOT hidden because VideoGallery needs to have
          // possession of the dominant remote participant video stream
          !props.hidden && localAndRemotePIP
        }
      </Modal>
    </Stack>
  );
};

/**
 * This is {@link MobilePane} component with a draggable LocalAndRemotePIP component that is bound by a LayerHost component with id `modalLayerHostId`
 * @private
 */
export const MobilePaneWithLocalAndRemotePIP = (
  props: MobilePaneProps & {
    callAdapter: CallAdapter;
    modalLayerHostId: string;
    styles?: MobilePaneWithLocalAndRemotePIPStyles;
  }
): JSX.Element => {
  return (
    <CallAdapterProvider adapter={props.callAdapter}>
      <_MobilePaneWithLocalAndRemotePIP {...props} />
    </CallAdapterProvider>
  );
};
