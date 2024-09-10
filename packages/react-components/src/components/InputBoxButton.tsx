// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { ICalloutContentStyles, IconButton, Stack, TooltipHost, mergeStyles, useTheme } from '@fluentui/react';
import { useState } from 'react';
import { isDarkThemed } from '../theming/themeUtils';
import React from 'react';
import { iconWrapperStyle, inputBoxButtonStyle, inputBoxButtonTooltipStyle } from './styles/InputBoxButton.style';

/**
 * Props for displaying a send button besides the text input area.
 *
 * @private
 */
export type InputBoxButtonProps = {
  onRenderIcon: (isHover: boolean) => JSX.Element;
  onClick: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  className?: string;
  id?: string;
  ariaLabel?: string;
  tooltipContent?: string;
  'data-testId'?: string;
  disabled?: boolean;
  ariaExpanded?: boolean;
};

/**
 * @private
 */
export const InputBoxButton = (props: InputBoxButtonProps): JSX.Element => {
  const {
    onRenderIcon,
    onClick,
    ariaLabel,
    className,
    id,
    tooltipContent,
    'data-testId': dataTestId,
    disabled = false,
    ariaExpanded = false
  } = props;
  const [isHover, setIsHover] = useState(false);
  const mergedButtonStyle = mergeStyles(inputBoxButtonStyle, className);

  const theme = useTheme();
  const calloutStyle: Partial<ICalloutContentStyles> = { root: { padding: 0 }, calloutMain: { padding: '0.5rem' } };

  // Place callout with no gap between it and the button.
  const calloutProps = {
    gapSpace: 0,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };
  return (
    <TooltipHost hostClassName={inputBoxButtonTooltipStyle} content={tooltipContent} calloutProps={{ ...calloutProps }}>
      <IconButton
        className={mergedButtonStyle}
        ariaLabel={ariaLabel}
        onClick={onClick}
        id={id}
        onMouseEnter={() => {
          setIsHover(true);
        }}
        onMouseLeave={() => {
          setIsHover(false);
        }}
        // VoiceOver fix: Avoid icon from stealing focus when IconButton is double-tapped to send message by wrapping with Stack with pointerEvents style to none
        onRenderIcon={() => <Stack className={iconWrapperStyle}>{onRenderIcon(isHover)}</Stack>}
        data-testid={dataTestId}
        aria-expanded={ariaExpanded}
        disabled={disabled}
      />
    </TooltipHost>
  );
};
