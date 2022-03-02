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
export const sendBoxStyle = mergeStyles({
  paddingRight: '2rem'
});

/**
 * @private
 */
export const sendButtonStyle = mergeStyles({
  height: '1.25rem',
  width: '1.25rem',
  marginRight: '0.313rem' // 5px
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
export const fileCardBoxStyle = mergeStyles({
  width: '100%',
  padding: '0.50rem'
});

const defaultSendBoxInactiveBorderThicknessREM = 0.0625;
const defaultSendBoxActiveBorderThicknessREM = 0.125;

/**
 * @private
 */
export const borderAndBoxShadowStyle = (
  theme: Theme,
  errorColor: string,
  hasErrorMessage: boolean,
  disabled: boolean
): IStyle => {
  const borderColor = hasErrorMessage ? errorColor : theme.palette.neutralSecondary;
  const borderColorActive = hasErrorMessage
    ? errorColor
    : disabled
    ? theme.palette.neutralSecondary
    : theme.palette.themePrimary;

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

/**
 * @private
 */
export const errorBarStyle = (theme: Theme): IStyle => {
  return {
    background: '#FFF4CE',
    padding: '0.50rem',
    borderRadius: theme.effects.roundedCorner4
  };
};
