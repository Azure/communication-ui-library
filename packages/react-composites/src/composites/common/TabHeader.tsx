// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, Stack } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
/* @conditional-compile-remove(one-to-n-calling) */
import { CallCompositeStrings } from '../CallComposite';
import { CallWithChatCompositeStrings } from '../CallWithChatComposite';
import { CallWithChatCompositeIcon } from '../common/icons';
import {
  mobilePaneBackButtonStyles,
  mobilePaneButtonStyles,
  mobilePaneControlBarStyle,
  mobilePaneHiddenIconStyles
} from './styles/Pane.styles';

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
  strings: CallWithChatCompositeStrings | /* @conditional-compile-remove(one-to-n-calling) */ CallCompositeStrings;
  disableChatButton?: boolean;
  disablePeopleButton?: boolean;
};

/**
 * @private
 */
export const TabHeader = (props: TabHeaderProps): JSX.Element => {
  const { onClose, onChatButtonClicked, onPeopleButtonClicked, activeTab, strings } = props;
  const theme = useTheme();
  const haveMultipleTabs = onChatButtonClicked && onPeopleButtonClicked;
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

  return (
    <Stack horizontal grow styles={mobilePaneControlBarStyle}>
      <DefaultButton
        ariaLabel={strings.returnToCallButtonAriaLabel}
        ariaDescription={strings.returnToCallButtonAriaDescription}
        onClick={onClose}
        styles={mobilePaneBackButtonStyles}
        onRenderIcon={() => <CallWithChatCompositeIcon iconName="ChevronLeft" />}
        autoFocus
      ></DefaultButton>
      <Stack.Item grow>
        {onChatButtonClicked && (
          <DefaultButton
            onClick={onChatButtonClicked}
            styles={mobilePaneButtonStylesThemed}
            checked={activeTab === 'chat'}
            role={'tab'}
            disabled={props.disableChatButton}
          >
            {strings.chatButtonLabel}
          </DefaultButton>
        )}
      </Stack.Item>
      <Stack.Item grow>
        {onPeopleButtonClicked && (
          <DefaultButton
            onClick={onPeopleButtonClicked}
            styles={mobilePaneButtonStylesThemed}
            checked={activeTab === 'people'}
            role={'tab'}
            disabled={props.disablePeopleButton}
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
