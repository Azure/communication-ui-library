// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { DefaultButton, ICalloutContentStyles, mergeStyles, TooltipHost } from '@fluentui/react';
import React, { useState } from 'react';
import { iconWrapperStyle, buttonStyle } from './styles/VoiceOverButton.style';

import { useTheme } from '../theming';
import { isDarkThemed } from '../theming/themeUtils';
import { InputBoxButtonProps } from './InputBoxComponent';
import { inputButtonTooltipStyle } from './styles/InputBoxComponent.style';

/**
 * @private
 */
export const VoiceOverButton = (props: InputBoxButtonProps): JSX.Element => {
  const { onRenderIcon, onClick, ariaLabel, className, id, tooltipContent } = props;
  const [isHover, setIsHover] = useState(false);
  const mergedButtonStyle = mergeStyles(buttonStyle, className);

  const theme = useTheme();
  const calloutStyle: Partial<ICalloutContentStyles> = { root: { padding: 0 }, calloutMain: { padding: '0.5rem' } };

  // Place callout with no gap between it and the button.
  const calloutProps = {
    gapSpace: 0,
    styles: calloutStyle,
    backgroundColor: isDarkThemed(theme) ? theme.palette.neutralLighter : ''
  };
  return (
    <TooltipHost hostClassName={inputButtonTooltipStyle} content={tooltipContent} calloutProps={{ ...calloutProps }}>
      <DefaultButton
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
      />
      {/* VoiceOver fix: Avoid rerender of DefaultButton above that handles clicking and hovering by keeping rerendering icon separate */}
      <div className={iconWrapperStyle}>{onRenderIcon(isHover)}</div>
    </TooltipHost>
  );
};
