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
  mobilePaneControlBarStyle,
  mobilePaneHiddenIconStyles
} from './styles/MobilePane.styles';

/**
 * Props for {@link TabHeader} component
 */
type TabHeaderProps = {
  onClose: () => void;
  // If set, show a button to open chat tab.
  onChatButtonClicked?: () => void;
  // If set, show a button to open people tab.
  onPeopleButtonClicked?: () => void;
  activeTab: TabHeaderTab;
};

/**
 * @private
 */
export const TabHeader = (props: TabHeaderProps): JSX.Element => {
  const theme = useTheme();
  const haveMultipleTabs = props.onChatButtonClicked && props.onPeopleButtonClicked;
  const mobilePaneButtonStylesThemed = useMemo(() => {
    return concatStyleSets(
      mobilePaneButtonStyles,
      {
        root: {
          width: '100%'
        },
        label: {
          fontSize: theme.fonts.medium.fontSize,
          fontWeight: theme.fonts.medium.fontWeight
        }
      },
      haveMultipleTabs
        ? {
            rootChecked: {
              borderBottom: `0.125rem solid ${theme.palette.themePrimary}`
            }
          }
        : {}
    );
  }, [theme, haveMultipleTabs]);
  const strings = useCallWithChatCompositeStrings();

  return (
    <Stack horizontal grow styles={mobilePaneControlBarStyle}>
      <DefaultButton
        ariaLabel={strings.returnToCallButtonAriaLabel}
        ariaDescription={strings.returnToCallButtonAriaDescription}
        onClick={props.onClose}
        styles={mobilePaneBackButtonStyles}
        onRenderIcon={() => <CallWithChatCompositeIcon iconName="ChevronLeft" />}
        autoFocus
      ></DefaultButton>
      <Stack.Item grow>
        {props.onChatButtonClicked && (
          <DefaultButton
            onClick={props.onChatButtonClicked}
            styles={mobilePaneButtonStylesThemed}
            checked={props.activeTab === 'chat'}
            role={'tab'}
          >
            {strings.chatButtonLabel}
          </DefaultButton>
        )}
      </Stack.Item>
      <Stack.Item grow>
        {props.onPeopleButtonClicked && (
          <DefaultButton
            onClick={props.onPeopleButtonClicked}
            styles={mobilePaneButtonStylesThemed}
            checked={props.activeTab === 'people'}
            role={'tab'}
          >
            {strings.peopleButtonLabel}
          </DefaultButton>
        )}
      </Stack.Item>
      {/* Hidden icon to take the same space as the actual back button on the left. */}
      <DefaultButton
        styles={mobilePaneHiddenIconStyles}
        onRenderIcon={() => <CallWithChatCompositeIcon iconName="ChevronLeft" />}
      ></DefaultButton>
    </Stack>
  );
};

/**
 * Type used to define which tab is active in {@link TabHeader}
 */
export type TabHeaderTab = 'chat' | 'people';
