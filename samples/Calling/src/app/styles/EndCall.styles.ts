// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { IButtonStyles, IStackTokens, mergeStyles } from '@fluentui/react';

/**
 * Style properties for the End Call component.
 * These styles are used to layout the end call screen components.
 */
export const mainStackTokens: IStackTokens = {
  childrenGap: '1rem'
};
/**
 * Styles for the end call screen buttons stack.
 * These styles ensure that the buttons are spaced correctly.
 */
export const buttonsStackTokens: IStackTokens = {
  childrenGap: '0.75rem'
};
/**
 * Styles for the end call screen buttons stack.
 * These styles ensure that the buttons are spaced correctly.
 */
export const upperStackTokens: IStackTokens = {
  childrenGap: '1.5rem'
};
/**
 * Styles for the end call screen bottom stack.
 * These styles ensure that the bottom stack is spaced correctly.
 */
export const bottomStackTokens: IStackTokens = {
  childrenGap: '1.4375rem'
};
/**
 * Styles for the end call screen container.
 * These styles ensure that the container takes up the full height and width of the screen.
 */
export const endCallContainerStyle = mergeStyles({
  height: '100%',
  width: '100% ',
  padding: '0.5rem', //half childrenGap from Stack
  minWidth: '21.625rem', // max of min-width from stack items + padding * 2 = 20.625 + 0.5 * 2
  minHeight: 'auto'
});
/**
 * Styles for the end call screen header.
 * These styles ensure that the header takes up the full width of the screen.
 */
export const endCallTitleStyle = mergeStyles({
  fontSize: '1.375rem',
  fontWeight: 600,
  width: '20rem'
});
/**
 * Styles for the end call screen button.
 * These styles ensure that the button text is styled correctly.
 */
export const buttonStyle = mergeStyles({
  fontWeight: 600,
  height: '2.5rem',
  width: '9.875rem',
  fontSize: '0.875rem', // 14px
  padding: 0
});
/**
 * Styles for the end call screen button with icon.
 * These styles ensure that the button text container is displayed correctly.
 */
export const buttonWithIconStyles: IButtonStyles = {
  textContainer: {
    display: 'contents'
  }
};
/**
 * Styles for the end call screen button icon.
 * These styles ensure that the icon is displayed correctly.
 */
export const videoCameraIconStyle = mergeStyles({
  marginRight: '0.375rem',
  fontSize: '1.375rem'
});
/**
 * Styles for the end call screen footer.
 * These styles ensure that the footer text is styled correctly.
 */
export const bottomStackFooterStyle = mergeStyles({
  fontSize: '0.875 rem'
});
