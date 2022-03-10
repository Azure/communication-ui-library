// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, Stack } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallWithChatCompositeIcon } from '../common/icons';
import { useCallWithChatCompositeStrings } from './hooks/useCallWithChatCompositeStrings';
import {
  mobilePaneBackButtonStyles,
  mobilePaneButtonStyles,
  mobilePaneControlBarStyle
} from './styles/MobilePane.styles';

/**
 * Props for {@link TabHeader} component
 */
type TabHeaderProps = {
  onClose: () => void;
  onChatButtonClicked: () => void;
  onPeopleButtonClicked: () => void;
  activeTab: TabHeaderTab;
};

/**
 * @private
 */
export const TabHeader = (props: TabHeaderProps): JSX.Element => {
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
  );
};

const ChevronLeftIconTrampoline = (): JSX.Element => {
  // @conditional-compile-remove(call-with-chat-composite)
  return <CallWithChatCompositeIcon iconName="ChevronLeft" />;

  // Return _something_ in stable builds to satisfy build system
  return <CallWithChatCompositeIcon iconName="ControlButtonEndCall" />;
};

/**
 * Type used to define which tab is active in {@link TabHeader}
 */
export type TabHeaderTab = 'chat' | 'people';
