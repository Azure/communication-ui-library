// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { concatStyleSets, DefaultButton, FocusZone, FocusZoneDirection, mergeStyles, Stack } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { CallWithChatCompositeIcon } from '../common/icons';
import {
  availableSpaceStyles,
  mobilePaneBackButtonStyles,
  mobilePaneButtonStyles,
  mobilePaneControlBarStyle,
  mobilePaneHiddenIconStyles
} from './styles/Pane.styles';
import { useLocale } from '../localization';

/** @private */
export interface MobileChatSidePaneTabHeaderProps {
  onClick: () => void;
  disabled: boolean;
}

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
  const strings = useLocale().strings.call;
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
      <Stack.Item grow role="tablist">
        <FocusZone direction={FocusZoneDirection.horizontal} className={mergeStyles(availableSpaceStyles.root)}>
          <Stack horizontal styles={availableSpaceStyles}>
            <Stack.Item grow>
              {onChatButtonClicked && (
                <DefaultButton
                  onClick={onChatButtonClicked}
                  styles={mobilePaneButtonStylesThemed}
                  checked={activeTab === 'chat'}
                  aria-selected={activeTab === 'chat'}
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
                  aria-selected={activeTab === 'people'}
                  role={'tab'}
                  disabled={props.disablePeopleButton}
                >
                  {strings.peopleButtonLabel}
                </DefaultButton>
              )}
            </Stack.Item>
          </Stack>
        </FocusZone>
      </Stack.Item>
      {
        /* Hidden icon to take the same space as the actual back button on the left. */
        <DefaultButton
          styles={mobilePaneHiddenIconStyles}
          onRenderIcon={() => <CallWithChatCompositeIcon iconName="ChevronLeft" />}
        />
      }
    </Stack>
  );
};

/**
 * Type used to define which tab is active in {@link TabHeader}
 */
export type TabHeaderTab = 'chat' | 'people';
