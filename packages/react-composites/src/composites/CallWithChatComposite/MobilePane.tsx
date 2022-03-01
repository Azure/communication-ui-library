// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, Stack } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useEffect, useMemo } from 'react';
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
  mobilePaneStyle
} from './styles/MobilePane.styles';

/**
 * This is a wrapper for Chat and People pane to cover the entire the screen and to have
 * its own navigation bar
 * @private
 */
export const MobilePane = (props: {
  onClose: () => void;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  children: React.ReactNode;
  hidden: boolean;
  dataUiId: string;
  activeTab: MobilePaneTab;
  disableBackButton?: boolean;
}): JSX.Element => {
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

  useEffect(() => {
    // disable back button when boolean is true and mobile pane is not hidden
    if (props.disableBackButton && !props.hidden) {
      window.onpopstate = function () {
        window.history.forward();
        props.onClose();
      };
    } else {
      // remove onpopstate listener otherwise
      window.onpopstate = null;
    }
  }, [props.disableBackButton, props.hidden]);

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
