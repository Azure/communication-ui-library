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
  ariaDisabled?: boolean;
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
    ariaDisabled = false,
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
      {/* IconButton doesn't support aria-disabled so adding a parent element that wil have this value set */}
      {/* in this case aria-disabled will be set to the same value for all children elements */}
      {/* see aria-disabled documentation for more information */}
      <Stack aria-disabled={ariaDisabled}>
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
        />
      </Stack>
    </TooltipHost>
  );
};
