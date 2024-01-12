// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Theme, mergeStyles } from '@fluentui/react';

/**
 * @private
 */
export const defaultSendBoxInactiveBorderThicknessREM = 0.0625;
/**
 * @private
 */
export const defaultSendBoxActiveBorderThicknessREM = 0.125;

/**
 * @private
 */
export const sendBoxStyle = ({
  theme,
  hasErrorMessage,
  disabled
}: {
  theme: Theme;
  hasErrorMessage: boolean;
  disabled: boolean;
}): string => {
  const borderColor = hasErrorMessage ? theme.semanticColors.errorText : theme.palette.neutralSecondary;
  const borderColorActive = hasErrorMessage ? theme.semanticColors.errorText : theme.palette.themePrimary;

  const borderThickness = disabled ? 0 : defaultSendBoxInactiveBorderThicknessREM;
  const borderActiveThickness = disabled ? 0 : defaultSendBoxActiveBorderThicknessREM;

  return mergeStyles({
    borderRadius: theme.effects.roundedCorner4,
    border: `${borderThickness}rem solid ${borderColor}`,

    // The border thickness of the sendbox wrapper changes on hover, to prevent the border thickness change causing the
    // input box to shift we apply a margin to compensate. This margin is then removed on hover when the border is thicker.
    margin: `${defaultSendBoxActiveBorderThicknessREM - borderThickness}rem`,

    ':hover, :active, :focus, :focus-within': {
      border: `${borderActiveThickness}rem solid ${borderColorActive}`,
      margin: `${defaultSendBoxActiveBorderThicknessREM - borderActiveThickness}rem`
    }
  });
};
