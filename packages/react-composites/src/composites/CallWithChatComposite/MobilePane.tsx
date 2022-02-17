// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, FontIcon, Stack } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React from 'react';
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
}): JSX.Element => {
  // We hide the mobile pane instead of not rendering the entire pane to persist certain elements
  // between renders. An example of this is composing a chat message - a chat message that has been
  // typed but not sent should not be lost if the side panel is closed and then reopened.
  const mobilePaneStyles = props.hidden ? hiddenMobilePaneStyle : mobilePaneStyle;
  const theme = useTheme();
  const chatAndPeoplePaneButtonStylesThemed = concatStyleSets(mobilePaneButtonStyles, {
    rootChecked: {
      borderBottom: `0.125rem solid ${theme.palette.themePrimary}`
    }
  });
  const strings = useCallWithChatCompositeStrings();

  return (
    <Stack verticalFill grow styles={mobilePaneStyles} data-ui-id={props.dataUiId}>
      <Stack horizontal grow styles={mobilePaneControlBarStyle}>
        <DefaultButton
          onClick={props.onClose}
          styles={mobilePaneBackButtonStyles}
          onRenderIcon={() => <FontIcon iconName="ChevronLeft" />}
        ></DefaultButton>
        <DefaultButton
          onClick={props.onChatButtonClicked}
          styles={chatAndPeoplePaneButtonStylesThemed}
          checked={props.activeTab === 'chat'}
        >
          {strings.chatButtonLabel}
        </DefaultButton>
        <DefaultButton
          onClick={props.onPeopleButtonClicked}
          styles={chatAndPeoplePaneButtonStylesThemed}
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

type MobilePaneTab = 'chat' | 'people';
