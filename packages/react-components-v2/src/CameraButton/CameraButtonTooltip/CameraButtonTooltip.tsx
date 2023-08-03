// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import { CameraButtonTooltipProps } from './CameraButtonTooltip.types';
import { ForwardRefComponent, Tooltip, resolveShorthand } from '@fluentui/react-components';
import { useLocale } from '../../localization';

/**
 * Tooltip designed with appropriate defaults and localization support to be used with camera buttons.
 *
 * @public
 */
export const CameraButtonTooltip: ForwardRefComponent<CameraButtonTooltipProps> = React.forwardRef((props, ref) => {
  const { cameraState, ...restOfProps } = props;
  const strings = useLocale().strings.cameraButtonTooltip;

  const tooltipContent =
    cameraState === 'on'
      ? strings?.cameraOnContent
      : cameraState === 'disabled'
      ? strings?.cameraButtonDisabledContent
      : cameraState === 'loading'
      ? strings?.cameraButtonVideoLoadingContent
      : strings?.cameraOffContent;

  const tooltipProps = resolveShorthand(restOfProps, {
    required: true,
    defaultProps: {
      content: tooltipContent,
      relationship: 'label'
    }
  });

  return <Tooltip ref={ref} {...tooltipProps} />;
});

CameraButtonTooltip.displayName = 'CameraButtonTooltip';
