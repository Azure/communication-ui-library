// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
import { CommandBarButton, DefaultButton, Stack, concatStyleSets } from '@fluentui/react';
import { useTheme } from '@internal/react-components';
import React, { useMemo } from 'react';
import { sidePaneHeaderContainerStyles, sidePaneHeaderStyles } from '../common/styles/ParticipantContainer.styles';
import {
  mobilePaneBackButtonStyles,
  mobilePaneButtonStyles,
  mobilePaneControlBarStyle,
  mobilePaneHiddenIconStyles
} from './styles/Pane.styles';
import { CallWithChatCompositeIcon } from './icons';

/**
 * @private
 */
export const SidePaneHeader = (props: {
  headingText?: string;
  dismissSidePaneButtonAriaLabel?: string;
  dismissSidePaneButtonAriaDescription?: string;
  onClose: () => void;
  mobileView: boolean;
}): JSX.Element => {
  const theme = useTheme();
  const sidePaneCloseButtonStyles = useMemo(
    () => ({
      root: { minWidth: '1.5rem', padding: 0, backgroundColor: theme.semanticColors.bodyBackground },
      icon: { color: theme.palette.neutralSecondary },
      iconHovered: { color: theme.palette.neutralSecondary },
      iconPressed: { color: theme.palette.neutralSecondary }
    }),
    [theme.palette.neutralSecondary, theme.semanticColors.bodyBackground]
  );

  if (props.mobileView) {
    return <SidePaneMobileHeader {...props} />;
  }

  return (
    <Stack horizontal horizontalAlign="space-between" styles={sidePaneHeaderContainerStyles}>
      <Stack.Item styles={sidePaneHeaderStyles}>{props.headingText}</Stack.Item>
      <CommandBarButton
        ariaLabel={props.dismissSidePaneButtonAriaLabel}
        styles={sidePaneCloseButtonStyles}
        iconProps={{ iconName: 'cancel' }}
        onClick={props.onClose}
      />
    </Stack>
  );
};

const SidePaneMobileHeader = (props: {
  headingText?: string;
  dismissSidePaneButtonAriaLabel?: string;
  dismissSidePaneButtonAriaDescription?: string;
  onClose: () => void;
}): JSX.Element => {
  const { headingText, dismissSidePaneButtonAriaLabel, dismissSidePaneButtonAriaDescription, onClose } = props;
  const theme = useTheme();
  const mobilePaneButtonStylesThemed = useMemo(() => {
    return concatStyleSets(mobilePaneButtonStyles, {
      root: {
        width: '100%'
      },
      label: {
        fontSize: theme.fonts.medium.fontSize,
        fontWeight: theme.fonts.medium.fontWeight
      }
    });
  }, [theme]);

  return (
    <Stack horizontal grow styles={mobilePaneControlBarStyle}>
      <DefaultButton
        ariaLabel={dismissSidePaneButtonAriaLabel}
        ariaDescription={dismissSidePaneButtonAriaDescription}
        onClick={onClose}
        styles={mobilePaneBackButtonStyles}
        onRenderIcon={() => <CallWithChatCompositeIcon iconName="ChevronLeft" />}
        autoFocus
      ></DefaultButton>
      <Stack.Item grow>
        <DefaultButton checked={true} styles={mobilePaneButtonStylesThemed}>
          {headingText}
        </DefaultButton>
      </Stack.Item>
      {/* Hidden icon to take the same space as the actual back button on the left. */}
      <DefaultButton
        styles={mobilePaneHiddenIconStyles}
        ariaHidden={true}
        onRenderIcon={() => <CallWithChatCompositeIcon iconName="ChevronLeft" />}
      ></DefaultButton>
    </Stack>
  );
};
