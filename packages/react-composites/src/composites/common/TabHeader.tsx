// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { concatStyleSets, DefaultButton, Stack } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallWithChatCompositeIcon } from '../common/icons';
import {
  mobilePaneBackButtonStyles,
  mobilePaneButtonStyles,
  mobilePaneControlBarStyle,
  mobilePaneHiddenIconStyles
} from './styles/Pane.styles';
import { useLocale } from '../localization';
import { CommonCallControlOptions } from './types/CommonCallControlOptions';

/**
 * Props for {@link TabHeader} component
 */
type PeopleAndChatHeaderProps = {
  onClose: () => void;
  // If set, show a button to open chat tab.
  onChatButtonClicked?: () => void;
  // If set, show a button to open people tab.
  onPeopleButtonClicked?: () => void;
  activeTab: TabHeaderTab;
  disableChatButton?: boolean;
  disablePeopleButton?: boolean;
};

/**
 * Legacy header to be removed when we make a breaking change.
 * @private
 */
export const PeopleAndChatHeader = (props: PeopleAndChatHeaderProps): JSX.Element => {
  const { onClose, onChatButtonClicked, onPeopleButtonClicked, activeTab } = props;
  const theme = useTheme();
  const strings = useLocale().strings;
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
        ariaLabel={strings.call.returnToCallButtonAriaLabel ?? strings.callWithChat.returnToCallButtonAriaLabel}
        ariaDescription={
          strings.call.returnToCallButtonAriaDescription ?? strings.callWithChat.returnToCallButtonAriaDescription
        }
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
            {strings.callWithChat.chatButtonLabel}
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
            {strings.call.peopleButtonLabel ?? strings.callWithChat.peopleButtonLabel}
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

/* @conditional-compile-remove(one-to-n-calling) @conditional-compile-remove(PSTN-calls) */
const shouldShowPeopleTabHeaderButton = (callControls?: boolean | CommonCallControlOptions): boolean => {
  if (callControls === undefined || callControls === true) {
    return true;
  }
  if (callControls === false) {
    return false;
  }
  return callControls.participantsButton !== false;
};
