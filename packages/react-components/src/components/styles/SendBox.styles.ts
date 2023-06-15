// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import { mergeStyles, IStyle, Theme } from '@fluentui/react';

/**
 * @private
 */
export const suppressIconStyle = {
  iconContainer: { minHeight: '0', minWidth: '0', height: '0', width: '0', margin: '0' },
  icon: { display: 'none' }
};

/**
 * @private
 */
export const sendBoxWrapperStyles = mergeStyles({
  margin: '0.25rem',
  overflow: 'hidden',
  /**
   * margin-top set for all the child components of sendbox except first
   */
  ':not(:first-child)': {
    marginTop: '0.25rem'
  }
});

/**
 * @private
 */
export const sendButtonStyle = mergeStyles({
  height: '2.25rem',
  width: '2.25rem'
});

/**
 * @private
 */
export const sendIconStyle = mergeStyles({
  width: '1.25rem',
  height: '1.25rem',
  margin: 'auto'
});

/**
 * @private
 */
export const fileUploadCardsStyles = mergeStyles({
  margin: '0 0.25rem 0.25rem 0.25rem',
  maxHeight: '12.5rem',
  overflow: 'auto'
});

/**
 * @private
 */
export const fileCardBoxStyle = mergeStyles({
  width: '100%',
  padding: '0.50rem'
});

const defaultSendBoxInactiveBorderThicknessREM = 0.0625;
const defaultSendBoxActiveBorderThicknessREM = 0.125;

/**
 * @private
 */
export const borderAndBoxShadowStyle = (props: {
  theme: Theme;
  hasErrorMessage: boolean;
  disabled: boolean;
}): IStyle => {
  const { theme, hasErrorMessage, disabled } = props;
  const borderColor = hasErrorMessage ? theme.semanticColors.errorText : theme.palette.neutralSecondary;
  const borderColorActive = hasErrorMessage ? theme.semanticColors.errorText : theme.palette.themePrimary;

  const borderThickness = disabled ? 0 : defaultSendBoxInactiveBorderThicknessREM;
  const borderActiveThickness = disabled ? 0 : defaultSendBoxActiveBorderThicknessREM;

  return {
    borderRadius: theme.effects.roundedCorner4,
    border: `${borderThickness}rem solid ${borderColor}`,

    // The border thickness of the sendbox wrapper changes on hover, to prevent the border thickness change causing the
    // input box to shift we apply a margin to compensate. This margin is then removed on hover when the border is thicker.
    margin: `${defaultSendBoxActiveBorderThicknessREM - borderThickness}rem`,

    ':hover, :active, :focus, :focus-within': {
      border: `${borderActiveThickness}rem solid ${borderColorActive}`,
      margin: `${defaultSendBoxActiveBorderThicknessREM - borderActiveThickness}rem`
    }
  };
};
